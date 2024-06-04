import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, MoreThan, Not, In } from 'typeorm';
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
        // 색깔 "기타" 처리
        if (pill.colorClass1 !== null) {
            if (pill.colorClass1 !== "기타") {
                conditions['colorClass1'] = Like(`%${pill.colorClass1}%`);
            } else {
                conditions['colorClass1'] = Not(In([
                    Like("%하양%"),
                    Like("%분홍%"),
                    Like("%노랑%"),
                    Like("%주황%"),
                    Like("%갈색%"),
                    Like("%파랑%"),
                    Like("%연두%"),
                    Like("%초록%"),
                    Like("%빨강%"),
                    Like("%회색%"),
                    Like("%보라%"),
                    Like("%검정%"),
                    Like("%청록%"),
                    Like("%자주%"),
                    Like("%남색%"),
                    Like("%갈색%")
                ]))
            }
        }

        if (pill.colorClass2 !== null) {
            if (pill.colorClass2 !== "기타") {
                conditions['colorClass2'] = Like(`%${pill.colorClass2}%`);
            } else {
                conditions['colorClass2'] = Not(In([
                    Like("%하양%"),
                    Like("%분홍%"),
                    Like("%노랑%"),
                    Like("%주황%"),
                    Like("%갈색%"),
                    Like("%파랑%"),
                    Like("%연두%"),
                    Like("%초록%"),
                    Like("%빨강%"),
                    Like("%회색%"),
                    Like("%보라%"),
                    Like("%검정%"),
                    Like("%청록%"),
                    Like("%자주%"),
                    Like("%남색%"),
                    Like("%갈색%")
                ]))
            }
        }
        if (pill.lineFront !== null) conditions['lineFront'] = pill.lineFront;
        if (pill.lineBack !== null) conditions['lineBack'] = pill.lineBack;

        // 제형 "기타" 등록
        if (pill.formCodeName !== null) {
            if (pill.formCodeName !== "기타") {
                conditions['formCodeName'] = Like(`%${pill.formCodeName}%`);
            } else {
                conditions['formCodeName'] = Not(In([Like("%필름코팅정%"), Like("%나정%"), Like("%경질캡슐제%"), Like("%연질캡슐제%")]));
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
