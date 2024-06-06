import { Module } from '@nestjs/common';
import { MedRefsService } from './med-refs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedRef } from './med-ref.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedRef])
  ],
  providers: [MedRefsService],
  exports: [MedRefsService]
})
export class MedRefsModule {}