import { Module } from '@nestjs/common';
import { ScrapedMedsService } from './scraped-meds.service';

@Module({
  providers: [ScrapedMedsService]
})
export class ScrapedMedsModule {}
