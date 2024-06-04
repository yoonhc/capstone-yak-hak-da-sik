import { Test, TestingModule } from '@nestjs/testing';
import { ScrapedMedsService } from './scraped-meds.service';

describe('ScrapedMedsService', () => {
  let service: ScrapedMedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapedMedsService],
    }).compile();

    service = module.get<ScrapedMedsService>(ScrapedMedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
