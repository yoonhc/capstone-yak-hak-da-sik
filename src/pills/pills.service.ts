import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        private medsService: MedsService
    ) {}

    async getMedInfoPage(filter: PillFilterDTO, page: number, limit: number = 10): Promise<Med[]> {
        const conditions = {};
        if (filter.drugShape !== null) conditions['drugShape'] = filter.drugShape;
        if (filter.colorClass1 !== null) conditions['colorClass1'] = filter.colorClass1;
        if (filter.colorClass2 !== null) conditions['colorClass2'] = filter.colorClass2;
        if (filter.lineFront !== null) conditions['lineFront'] = filter.lineFront;
        if (filter.lineBack !== null) conditions['lineBack'] = filter.lineBack;
        if (filter.formCodeName !== null) conditions['formCodeName'] = filter.formCodeName;

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
