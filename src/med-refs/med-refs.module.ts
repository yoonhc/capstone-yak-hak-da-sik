import { Module } from '@nestjs/common';
import { MedRefsService } from './med-refs.service';

@Module({
  providers: [MedRefsService]
})
export class MedRefsModule {}
