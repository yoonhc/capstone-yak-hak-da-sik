// scraped-meds.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ScrapedMedsService } from './scraped-meds.service';
import { ScrapedMed } from './scraped-med.entity';

@Controller('scraped-meds')
export class ScrapedMedsController {
  constructor(private readonly scrapedMedsService: ScrapedMedsService) {}

  @Get(':id')
  async getScrapedMeds(@Param('id') id: string): Promise<ScrapedMed> {
    return this.scrapedMedsService.getScrapedMeds(parseInt(id, 10));
  }
}