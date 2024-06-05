// scraped-meds.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ScrapedMedsService } from './scraped-meds.service';

@Controller('scraped-meds')
export class ScrapedMedsController {
  constructor(private readonly scrapedMedsService: ScrapedMedsService) {}

  @Get(':id')
  async getScrapedMeds(@Param('id') id: string): Promise<string> {
    return this.scrapedMedsService.getScrapedMeds(parseInt(id, 10));
  }
}