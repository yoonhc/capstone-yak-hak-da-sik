import { Module } from '@nestjs/common';
import { PillsController } from './pills.controller';
import { PillsService } from './pills.service';
import { Pill } from './pill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedsModule } from '../meds/meds.module'; 
import { MedRefsModule } from 'src/med-refs/med-refs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pill]),
    MedsModule,
    MedRefsModule
  ],
  controllers: [PillsController],
  providers: [PillsService]
})
export class PillsModule {}
