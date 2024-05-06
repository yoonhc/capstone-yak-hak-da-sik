import { Module } from '@nestjs/common';
import { MedsController } from './meds.controller';
import { MedsService } from './meds.service';

@Module({
  controllers: [MedsController],
  providers: [MedsService]
})
export class MedsModule {}
