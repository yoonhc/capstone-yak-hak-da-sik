import { Module } from '@nestjs/common';
import { MedsController } from './meds.controller';
import { MedsService } from './meds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './med.entity';
import { GptsModule } from 'src/gpts/gpts.module';
import { MedRefsModule } from 'src/med-refs/med-refs.module';
import { DursModule } from 'src/durs/durs.module';
import { ScrapedMedsModule } from 'src/scraped-meds/scraped-meds.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Med]),
    GptsModule,
    MedRefsModule,
    DursModule,
    ScrapedMedsModule
  ],
  controllers: [MedsController],
  providers: [MedsService],
  exports: [MedsService, TypeOrmModule]
})
export class MedsModule {}
