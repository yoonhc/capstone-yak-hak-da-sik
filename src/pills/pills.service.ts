import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, MoreThan, Not, In, Brackets } from 'typeorm';
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';
import { MedsService } from '../meds/meds.service';
import { PillFilterDTO } from './dto/pill-filter-dto';
import { PillResponseDTO } from './dto/pill-response-dto';
import { MedRefsService } from 'src/med-refs/med-refs.service';

@Injectable()
export class PillsService {
    constructor(
        @InjectRepository(Pill)
        private pillRepository: Repository<Pill>,
        @InjectRepository(Med)
        private medRepository: Repository<Med>,
        private readonly configService: ConfigService,
        private medsService: MedsService,
        private medRefsService: MedRefsService
    ) {}

    async getMedInfoPage(pill: PillFilterDTO, page: number, limit: number = 10): Promise<PillResponseDTO[]> {
        const conditions = {};
        let onlyName = true;
        // 조건 등록
        if (pill.medName !== null && pill.medName !== "") {
            conditions['medName'] = Like(`%${pill.medName}%`);
        } else {
            console.log(`false in medName`)
            onlyName = false;
        }

        if (pill.drugShape !== null && pill.drugShape !== "") {
            console.log(`false in durgShape`)
            conditions['drugShape'] = pill.drugShape;
            onlyName = false;
        }
        if (pill.colorClass1 !== null && pill.colorClass1 !== "") {
            console.log(`false in colorClass1`)
            conditions['colorClass1'] = Like(`%${pill.colorClass1}%`);
            onlyName = false;
        }
        if (pill.colorClass2 !== null && pill.colorClass2 !== "") {
            console.log(`false in colorClass2`)
            conditions['colorClass2'] = Like(`%${pill.colorClass2}%`);
            onlyName = false;
        }
        if (pill.lineFront !== null && pill.lineFront !== "") {
            console.log(`false in lineFront`)
            conditions['lineFront'] = pill.lineFront;
            onlyName = false;
        }
        if (pill.lineBack !== null && pill.lineBack !== "") {
            console.log(`false in lineBack`)
            conditions['lineBack'] = pill.lineBack;
            onlyName = false;
        }

        // 브래킷으로 NOT LIKE를 여러 개 엮어서 '기타'를 구현하려고 했는데, 자꾸 오류가 생김
        // 그래서 그냥 "필름코팅정", "나정", "경질캡슐제", "연질캡슐제"를 포함하는 모든 항목을 찾아둠
        // 여기에 없는 값들을 모두 찾아줄 것임
        const commonForm = [
            "필름코팅정",
            "나정",
            "경질캡슐제, 산제",
            "서방성필름코팅정",
            "연질캡슐제, 액상",
            "연질캡슐제, 현탁상",
            "장용성필름코팅정",
            "경질캡슐제, 과립제",
            "경질캡슐제, 장용성과립제",
            "경질캡슐제, 서방성장용성펠렛",
            "경질캡슐제, 정제",
            "젤라틴코팅성경질캡슐제",
            "경질캡슐제, 과립제정제",
            "서방성장용필름코팅정",
            "경질캡슐제, 공캡슐"
        ];

        // 제형 "기타" 등록
        if (pill.formCodeName !== null && pill.formCodeName !== "") {
            onlyName = false;
            console.log(`false in formCodeName`)
            if (pill.formCodeName !== "기타") {
                // console.log("기타 외 값 확인됨");
                conditions['formCodeName'] = Like(`%${pill.formCodeName}%`);
            } else {
                // console.log("기타 확인됨");
                conditions['formCodeName'] = Not(In(commonForm))
            }
        }

        // 장축 조건 등록
        if (pill.lengLongOption !== null && pill.lengLongOption !== 0) {
            onlyName = false;
            console.log(`false in long`)
            switch(pill.lengLongOption) {
                case 1:
                    conditions['lengLong'] = Between(0, 4);
                    break;
                case 2:
                    conditions['lengLong'] = Between(4, 8);
                    break;
                case 3:
                    conditions['lengLong'] = Between(8, 12);
                    break;
                case 4:
                    conditions['lengLong'] = Between(12, 16);
                    break;
                case 5:
                    conditions['lengLong'] = Between(16, 20);
                    break;
                case 6:
                    conditions['lengLong'] = MoreThan(20);
                    break;
            }
        }

        // 단축 조건 등록
        if (pill.lengShortOption !== null && pill.lengShortOption !== 0) {
            onlyName = false;
            console.log(`false in short`)
            switch(pill.lengShortOption) {
                case 1:
                    conditions['lengShort'] = Between(0, 2);
                    break;
                case 2:
                    conditions['lengShort'] = Between(2, 4);
                    break;
                case 3:
                    conditions['lengShort'] = Between(4, 6);
                    break;
                case 4:
                    conditions['lengShort'] = Between(6, 8);
                    break;
                case 5:
                    conditions['lengShort'] = Between(8, 10);
                    break;
                case 6:
                    conditions['lengShort'] = MoreThan(10);
                    break;
            }
        }

        // 두께 조건 등록
        if (pill.thickOption !== null && pill.thickOption !== 0) {
            onlyName = false;
            console.log(`false in thick`)
            switch(pill.thickOption) {
                case 1:
                    conditions['thick'] = Between(0, 2);
                    break;
                case 2:
                    conditions['thick'] = Between(2, 4);
                    break;
                case 3:
                    conditions['thick'] = Between(4, 6);
                    break;
                case 4:
                    conditions['thick'] = Between(6, 8);
                    break;
                case 5:
                    conditions['thick'] = Between(8, 10);
                    break;
                case 6:
                    conditions['thick'] = MoreThan(10);
                    break;
            }
        }

        // Pills 테이블에서 정보 검색 및 저장
        // to do: 필터 정보가 전부 NULL이라면, med-ref에서 찾기
        let results;

        console.log(onlyName);

        if (onlyName) {
            console.log(`Searching in med-refs`);
            const medRefResults = await this.medRefsService.findMatchesByName(pill.medName, page, limit);
            const dtoResults = medRefResults.map(medRef => {
                let dto = new PillResponseDTO();
                dto.medName = medRef.medName;
                dto.id = medRef.id;
                dto.companyName = medRef.companyName;
                dto.image = medRef.image;
                return dto;
            });
            console.log("Pill IDs and Names:", dtoResults);
            return dtoResults;
        } else {
            console.log(`Searching in pills`);
            [results] = await this.pillRepository.findAndCount({
                where: conditions,
                select: ['medName', 'id', 'companyName', 'image'],
                skip: (page - 1) * limit,
                take: limit
            });
            console.log("Pill IDs and Names:", results);
            return results;
        }

        /*
        // E약은요 정보 템플릿 (수정해야함 - 이름, 번호, 회사, 사진)
        const defaultMed = {
            id: null,
            companyName: null,
            medName: null,
            effect: "해당하는 e약은요 정보가 없습니다.",
            howToUse: null,
            criticalInfo: null,
            warning: null,
            interaction: null,
            sideEffect: null,
            howToStore: null
        };

        // 결과 찾기
        const meds = await Promise.all(
            results.map(async pill => {
                try {
                    return await this.medRepository.findOneOrFail({ where: { id: pill.id } });
                } catch (error) {
                    return { 
                        ...defaultMed,
                        id: pill.id,
                        medName: pill.medName
                    };
                }
            })
        );
        */
    }
}
