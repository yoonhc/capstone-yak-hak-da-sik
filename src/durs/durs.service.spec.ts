import { Test, TestingModule } from '@nestjs/testing';
import { DursService } from './durs.service';

describe('DursService', () => {
  let service: DursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DursService],
    }).compile();

    service = module.get<DursService>(DursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
