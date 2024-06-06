import { Module } from '@nestjs/common';
import { DursService } from './durs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DUR } from './dur.entity';
import { MedRefsModule } from 'src/med-refs/med-refs.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DUR]),
    MedRefsModule
  ],
  providers: [DursService]
})
export class DursModule {}