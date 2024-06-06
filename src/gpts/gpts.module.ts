import { Module } from '@nestjs/common';
import { GptsService } from './gpts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedSummary } from './med-summary.entity';
import { GptsController } from './gpts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedSummary])
  ],
  providers: [GptsService],
  controllers: [GptsController],
  exports: [GptsService],
})
export class GptsModule {}