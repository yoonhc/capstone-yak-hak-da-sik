import { Module } from '@nestjs/common';
import { GptsService } from './gpts.service';

@Module({
  providers: [GptsService]
})
export class GptsModule {}
