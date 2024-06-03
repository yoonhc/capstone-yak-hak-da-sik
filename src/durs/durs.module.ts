import { Module } from '@nestjs/common';
import { DursService } from './durs.service';

@Module({
  providers: [DursService]
})
export class DursModule {}
