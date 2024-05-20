import { Test, TestingModule } from '@nestjs/testing';
import { PillsController } from './pills.controller';

describe('PillsController', () => {
  let controller: PillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PillsController],
    }).compile();

    controller = module.get<PillsController>(PillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
