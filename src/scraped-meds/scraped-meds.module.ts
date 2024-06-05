import { Module } from '@nestjs/common';
import { ScrapedMedsService } from './scraped-meds.service';
import { ScrapedMed } from './scraped-med.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapedMedsController } from './scraped-meds.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrapedMed]),
  ],
  providers: [ScrapedMedsService],
  controllers: [ScrapedMedsController]
})
export class ScrapedMedsModule {}
