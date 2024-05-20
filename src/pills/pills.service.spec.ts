import { Test, TestingModule } from '@nestjs/testing';
import { PillsService } from './pills.service';

describe('PillsService', () => {
  let service: PillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PillsService],
    }).compile();

    service = module.get<PillsService>(PillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
