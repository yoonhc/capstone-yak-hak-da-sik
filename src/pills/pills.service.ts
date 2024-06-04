import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, MoreThan, Not, In, Brackets } from 'typeorm';
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';
import { MedsService } from '../meds/meds.service';
import { PillFilterDTO } from './dto/pill-filter-dto';
import { PillResponseDTO } from './dto/pill-response-dto';

@Injectable()
export class PillsService {
    constructor(
        @InjectRepository(Pill)
        private pillRepository: Repository<Pill>,
        @InjectRepository(Med)
        private medRepository: Repository<Med>,
        private readonly configService: ConfigService,
        private medsService: MedsService
    ) {}

    async getMedInfoPage(pill: PillFilterDTO, page: number, limit: number = 10): Promise<PillResponseDTO[]> {
        const conditions = {};
        // 조건 등록
        if (pill.medName !== null) conditions['medName'] = Like(`%${pill.medName}%`);
        if (pill.drugShape !== null) conditions['drugShape'] = pill.drugShape;
        if (pill.colorClass1 !== null) conditions['colorClass1'] = Like(`%${pill.colorClass1}%`);
        if (pill.colorClass2 !== null) conditions['colorClass2'] = Like(`%${pill.colorClass2}%`);
        if (pill.lineFront !== null) conditions['lineFront'] = pill.lineFront;
        if (pill.lineBack !== null) conditions['lineBack'] = pill.lineBack;

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
        if (pill.formCodeName !== null) {
            if (pill.formCodeName !== "기타") {
                // console.log("기타 외 값 확인됨");
                conditions['formCodeName'] = Like(`%${pill.formCodeName}%`);
            } else {
                // console.log("기타 확인됨");
                conditions['formCodeName'] = Not(In(commonForm))
            }
        }

        // 장축 조건 등록
        if (pill.lengLongOption !== null) {
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
        if (pill.lengShortOption !== null) {
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
        if (pill.thickOption !== null) {
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
        const [results, total] = await this.pillRepository.findAndCount({
            where: conditions,
            select: ['medName', 'id', 'companyName', 'image'],
            skip: (page - 1) * 10,
            take: 10
        });

        console.log("Pill IDs and Names:", results);

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
        return results;
    }
}
