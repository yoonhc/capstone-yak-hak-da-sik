import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DUR } from './dur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DursService {
    constructor(
        @InjectRepository(DUR)
        private medRefRepository: Repository<DUR>,
    ) { }
}
