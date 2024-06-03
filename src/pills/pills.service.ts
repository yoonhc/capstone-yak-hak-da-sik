import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';
import { MedsService } from '../meds/meds.service';
import { PillFilterDTO } from './dto/pill-filter-dto';

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

    async getMedInfoPage(pill: PillFilterDTO, page: number, limit: number = 10): Promise<Med[]> {
        const conditions = {};
        if (pill.drugShape !== null) conditions['drugShape'] = pill.drugShape;
        if (pill.colorClass1 !== null) conditions['colorClass1'] = pill.colorClass1;
        if (pill.colorClass2 !== null) conditions['colorClass2'] = pill.colorClass2;
        if (pill.lineFront !== null) conditions['lineFront'] = pill.lineFront;
        if (pill.lineBack !== null) conditions['lineBack'] = pill.lineBack;
        if (pill.formCodeName !== null) conditions['formCodeName'] = pill.formCodeName;

        if (pill.lengLongMin !== null && pill.lengLongMax !== null) {
            conditions['lengLong'] = Between(pill.lengLongMin, pill.lengLongMax);
        }
        if (pill.lengShortMin !== null && pill.lengShortMax !== null) {
            conditions['lengShort'] = Between(pill.lengShortMin, pill.lengShortMax);
        }
        if (pill.thickMin !== null && pill.thickMax !== null) {
            conditions['thick'] = Between(pill.thickMin, pill.thickMax);
        }

        const [results, total] = await this.pillRepository.findAndCount({
            where: conditions,
            select: ['id', 'medName'],
            skip: (page - 1) * 10,
            take: 10
        });

        console.log("Pill IDs and Names:", results);

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

        return meds;
    }
}
