import { Module } from '@nestjs/common';
import { MedsController } from './meds.controller';
import { MedsService } from './meds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './med.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Med])],
  controllers: [MedsController],
  providers: [MedsService]
})
export class MedsModule {}
