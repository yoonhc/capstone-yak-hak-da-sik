import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';
import { MedsService } from '../meds/meds.service';

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

    async getMedInfoPage(pill: Pill, page: number, limit: number = 10): Promise<Med[]> {
        const { drugShape, colorClass1, colorClass2, lineFront, lineBack, formCodeName } = pill;

        const [results, total] = await this.pillRepository.findAndCount({
            where: {
                ...(drugShape && { drugShape }),
                ...(colorClass1 && { colorClass1 }),
                ...(colorClass2 && { colorClass2 }),
                ...(lineFront && { lineFront }),
                ...(lineBack && { lineBack }),
                ...(formCodeName && { formCodeName })
            },
            skip: (page - 1) * 10,
            take: 10
        });

        const pillIds = results.map(pill => pill.id);

        const meds = await Promise.all(
            pillIds.map(id => this.medRepository.findOne({ where: { id: id } }))
        );

        return meds.filter(med => med !== null);
        // 이렇게 얻어낸 result에서 id를 기준으로 medRepository에서 품목을 찾아 Med 배열로 저장한다.
        // 저장한 Med 배열을 반환한다.
    }
}
