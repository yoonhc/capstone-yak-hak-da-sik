import { Injectable, NotFoundException } from '@nestjs/common';
import { MedListDTO } from './dto/med-list-dto';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { OCRResultDTO } from './dto/ocr-result-dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Med } from './med.entity';
import { Repository } from 'typeorm';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';

@Injectable()
export class MedsService {
    constructor(
        @InjectRepository(Med)
        private medRepository: Repository<Med>,
        private readonly configService: ConfigService
    ) {}

    /*
    * JSON 형식인 ocrResult로부터 text를 추출한다 (text: "단어\n단어\n단어")
    * 그 다음 text로부터 쓸데없는 단어를 제외하는 전처리를 거친다.
    */
    preprocessOCR(ocrResult: OCRResultDTO): string {
        const extractedText: string = ocrResult.text;

        // 아직 전처리는 미구현
        return extractedText;
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
                // 만약 없다면, null값 채워넣고 로그 출력
                console.error(`Error fetching medicine: ${medName}`, error.message);
                return null;
            }
        });

        const medInfos = await Promise.all(medInfoPromises);
        // null값은 빼고 반환
        return medInfos.filter(med => med !== null);
    }

    // 약 이름을 인수로 받아서 단일 Med(e약은요) 객체를 반환
    async getMedInfoByName(name: string): Promise<Med> {
        const found = await this.medRepository.findOne({
            where: {
                medName: name,
            }
        })
        // 해당하는 약이 없을 시, Exception 발생
        if(!found) {
            throw new NotFoundException(`Can't find Board with name ${name}`)
        }
        return found;
    } 

    // GPT 결과("약물1, 약물2, 약물3")를 가지고 MedListDTO를 만든다. 
    // 차후에 각각 약물이 맞는지(e.g. db에 있는지) verify하는 기능을 넣어야 할 듯
    // 마지막 결과 리스트는 med-reference db에 이름이 있어야 하는게 좋을듯
    refineGPTResult(gptResult: string): MedListDTO {
        const medicationsArray = gptResult.split(", ");
        const medListDTO: MedListDTO = new MedListDTO();
        medListDTO.medications = medicationsArray;
        return medListDTO;
    }

    // responsebody에 있는 ocrResult를 가지고 약물 리스트인 MedListDTO 반환
    async extractMeds(ocrResult: OCRResultDTO): Promise<MedListDTO> {
        const preprocessed: string = this.preprocessOCR(ocrResult);
        return this.refineGPTResult(await this.getGPTResponse(preprocessed));
    }

    // 전처리된 ocr결과를 GPT에 요청해 약물 리스트를 "약물1, 약물2, 약물3"
    async getGPTResponse(preprocessed: string): Promise<string> {
        const endpoint: string = this.configService.get<string>('endpoint');
        const azureKeyCredential: string = this.configService.get<string>('azureKey');
        const deploymentId: string = this.configService.get<string>('deploymentID');
        const client: OpenAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureKeyCredential));

        const prompt = [
            {
                role: "system",
                content: 'You are a helpful assistant that extract only medication from list of words seperated by \\n.'
                    + 'Please extract only medications in given text and provide the result.\n'
                    + 'This is an example format: "medication1, medication2, medication3"'
            },
            {
                role: "user",
                content: preprocessed
            },
        ];

        const response = await client.getChatCompletions(deploymentId, prompt, {
            maxTokens: 200,
            temperature: 0.0,
        });

        if (response.choices.length > 0 && response.choices[0].message) {
            const gptResult: string = response.choices[0].message.content;
            return gptResult;
        } else {
            console.log("No message content found in the response.");
        }
    }

    //create(): Promise<Med> {}

    //update(): Promise<Med> {}

    //find(): Promise<Med[]> {}

    //findOne(id: number) : Promise<Med> {}

    //(검새창에 이름으로 검색하는 경우. med-ref쓰면 될듯)
    //findOneByName

}