import { Module } from '@nestjs/common';
import { DursService } from './durs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DUR } from './dur-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DUR])
  ],
  providers: [DursService]
})
export class DursModule {}