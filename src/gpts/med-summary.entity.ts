import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('med-summaries')
export class MedSummary {
  @PrimaryColumn({ type: 'int', width: 9 })
  id: number;
}