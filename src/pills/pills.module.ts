import { Module } from '@nestjs/common';
import { PillsController } from './pills.controller';
import { PillsService } from './pills.service';
import { Pill } from './pill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedsModule } from '../meds/meds.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Pill]),
    MedsModule
  ],
  controllers: [PillsController],
  providers: [PillsService]
})
export class PillsModule {}
