import { Test, TestingModule } from '@nestjs/testing';
import { ScrapedMedsController } from './scraped-meds.controller';

describe('ScrapedMedsController', () => {
  let controller: ScrapedMedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapedMedsController],
    }).compile();

    controller = module.get<ScrapedMedsController>(ScrapedMedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
