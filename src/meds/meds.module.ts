import { Module } from '@nestjs/common';
import { MedsController } from './meds.controller';
import { MedsService } from './meds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './med.entity';
import { GptsModule } from 'src/gpts/gpts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Med]),
    GptsModule
  ],
  controllers: [MedsController],
  providers: [MedsService],
  exports: [MedsService, TypeOrmModule]
})
export class MedsModule {}
