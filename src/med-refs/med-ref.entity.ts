import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('med-refs')
export class MedRef {
@PrimaryColumn({ type: 'int', width: 9 })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  medName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  companyName: string;

  @Column({
    type: 'enum',
    enum: ['전문의약품', '일반의약품'],
    nullable: false,
  })
  medType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  medClass: string;

  // 나중에 array 로 바꿔야함 dur: string[]; array: true
  @Column({ type: 'varchar', nullable: true })
  dur: string;
}