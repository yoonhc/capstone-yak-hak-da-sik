import { Test, TestingModule } from '@nestjs/testing';
import { MedRefsService } from './med-refs.service';

describe('MedRefsService', () => {
  let service: MedRefsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedRefsService],
    }).compile();

    service = module.get<MedRefsService>(MedRefsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
