import { Test, TestingModule } from '@nestjs/testing';
import { DursController } from './durs.controller';

describe('DursController', () => {
  let controller: DursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DursController],
    }).compile();

    controller = module.get<DursController>(DursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
