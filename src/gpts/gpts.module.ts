import { Module } from '@nestjs/common';
import { GptsService } from './gpts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedSummary } from './med-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedSummary])
  ],
  providers: [GptsService]
})
export class GptsModule {}