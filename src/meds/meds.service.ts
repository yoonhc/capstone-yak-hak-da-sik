import { Injectable, NotFoundException } from '@nestjs/common';
import { MedListDTO } from './dto/med-list-dto';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { OCRResultDTO } from './dto/ocr-result-dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Med } from './med.entity';
import { Repository, ILike } from 'typeorm';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { performance } from 'perf_hooks';
import { GptsService } from 'src/gpts/gpts.service';
import { MedRefsService } from 'src/med-refs/med-refs.service';
const RE2 = require('re2');

@Injectable()
export class MedsService {
    private regex: any;
    private keywords = [
        '발행기관', '영수증번호', '조제일', '환자성명', '약제비', '영수증', '사업자등록번호',
        '조제일자', '전화번호', '서식', '병원', '계산서', '부담금', '발진 주의', '복약안내',
        '발행', '조제한', '약사', '발전', '합계', '영수증번호', '식후', '약품이미지', '등록번호',
        '마세요', '하세요', '있어요', '나세요', '아침', '점심', '저녁', '취침 전', '있습니다',
        '알리세요', '사업장소재지', '신분확인번호', '현금승인번호', '수납금액', '님', '입니다'
    ];
    constructor(
        @InjectRepository(Med)
        private medRepository: Repository<Med>,
        private readonly configService: ConfigService,
        private gptService: GptsService,
        private medRefsService: MedRefsService
    ) {
        // 정규 표현식화
        const pattern = this.keywords.map(keyword => `${keyword}`).join('|');
        // 대소문자를 구분하지 않음
        this.regex = new RE2(pattern, 'i');
    }

    /*
    * JSON 형식인 ocrResult로부터 text를 추출한다 (text: "단어\n단어\n단어")
    * 그 다음 text로부터 쓸데없는 단어를 제외하는 전처리를 거친다.
    */
    preprocessOCR(ocrResult: OCRResultDTO): string {
        // 개행문자 (\n)을 기준으로 문장을 나눔
        // 각 문장이 관련 없는 단어를 포함한다면 제거한다.

        const lines = ocrResult.text.split('\n');
        // 키워드를 포함하지 않는 줄만 필터링
        console.log(`Total lines before preprocessing: ${lines.length}`);
        const filteredLines = lines.filter(line => {
            const isMatch = this.regex.test(line.trim());
            // console.log(`Testing line: ${line.trim()}`)
            // console.log(`Match: ${isMatch}`);
            if (!isMatch)
                return line.trim();
        });
        const preprocessedText = filteredLines.join('\n');
        console.log(preprocessedText);
        console.log(`Total lines after preprocessing: ${filteredLines.length}`);
        return preprocessedText;
    }

    // MedListDTO를 인수로 받아서 Med(e약은요 정보) 배열들을 반환
    async getMedInfoList(medListDTO: MedListDTO): Promise<Med[]> {

        // MedListDTO의 medications 자체가 비어있을 경우, 빈 배열 반환
        if (!medListDTO.medications || medListDTO.medications.length === 0) {
            return [];
        }

        // 비동기 함수 별도 실행으로 리소스 최대한 활용
        // Medications string 배열의 값들을 가지고 getMedInfoByName() 실행
        const medInfoPromises = medListDTO.medications.map(async (medName) => {
            try {
                return await this.getMedInfoByName(medName);
            } catch (error) {
                // 정확히 일치하는 값이 없다면 문자열을 포함하는 조건으로 검색
                try {
                    const likeResults = await this.getMedInfoByLikeName(medName);
                    return likeResults;  // 이름을 포함하는 결과 반환
                } catch (likeError) {
                    // 이름을 포함하는 약도 찾지 못했을 경우, 로그 출력 후 null 반환
                    console.error(`Error fetching medicine: ${medName}`, error.message);
                    return null;
                }
            }
        });

        const medInfos = await Promise.all(medInfoPromises);
        // flat() 후 null값은 빼고 반환
        return medInfos.flat().filter(med => med !== null);
    }

    // 약 이름을 인수로 받아서 단일 Med(e약은요) 객체를 반환
    async getMedInfoByName(name: string): Promise<Med> {
        const found = await this.medRepository.findOne({
            where: {
                medName: name,
            }
        })

        // 해당하는 약이 없을 시, Exception 발생
        if (!found) {
            throw new NotFoundException(`Can't find Board with name ${name}`)
        }

        return found;
    } 

    // 약 이름을 포함하는 모든 데이터 개체 검색
    async getMedInfoByLikeName(name: string): Promise<Med[]> {
        const likeMatches = await this.medRepository.find({
            where: {
                medName: ILike(`%${name}%`)
            }
        });

        // 결과가 완전히 비었을 경우 Exception 발생
        if (!likeMatches.length) {
            throw new NotFoundException(`Can't find any medicine containing the name '${name}'`);   
        }

        return likeMatches;
    }

    // GPT 결과("약물1, 약물2, 약물3")를 가지고 MedListDTO를 만든다. 
    // 차후에 각각 약물이 맞는지(e.g. db에 있는지) verify하는 기능을 넣어야 할 듯
    // 마지막 결과 리스트는 med-reference db에 이름이 있어야 하는게 좋을듯
    async refineGPTResult(gptResult: string): Promise<MedListDTO> {
        const medicationsArray = gptResult.split(", ");
        const postprocessedArray = await this.medRefsService.processMedNameBeforeSearch(medicationsArray);
        const medListDTO: MedListDTO = new MedListDTO();
        medListDTO.medications = postprocessedArray;
        return medListDTO;
    }

    // responsebody에 있는 ocrResult를 가지고 약물 리스트인 MedListDTO 반환
    async extractMeds(ocrResult: OCRResultDTO): Promise<MedListDTO> {
        // 이건 성능 비교한다고 잠시 써뒀던 건데, 궁금하면 주석 풀어서 비교해보면 됨
        // 사실 짧은 문장의 경우 큰 성능의 차이는 나지 않지만, 이후 확장성까지 고려하면 이런 기능은 중요함
        // 지금은 캡스톤 프로젝트 수준이어서 크게 와닿지 않을지 몰라도, 
        // 프로젝트 규모가 커지고 사용자가 늘어나면 대규모 데이터에 대한 처리가 필요할 수 있음
        const preprocessed: string = this.preprocessOCR(ocrResult);
        // const startTime = performance.now();
        // console.log(this.refineGPTResult(await this.gptService.gptExtractMeds((preprocessed)));
        // const endTime = performance.now();
        // console.log(`raw response time: ${endTime - startTime}ms`);
        // const pstartTime = performance.now();
        const result = this.refineGPTResult(await this.gptService.gptExtractMeds((preprocessed)));
        // const pendTime = performance.now();
        // console.log(`preprocessed response time: ${pendTime - pstartTime}ms`);
        return result;
    }
}