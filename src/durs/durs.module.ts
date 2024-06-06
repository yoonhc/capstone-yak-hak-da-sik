import { Module } from '@nestjs/common';
import { DursService } from './durs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DUR } from './dur.entity';
import { MedRefsModule } from 'src/med-refs/med-refs.module';
import { DursController } from './durs.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([DUR]),
    MedRefsModule
  ],
  controllers: [DursController],
  providers: [DursService],
  exports: [DursService],
})
export class DursModule {}