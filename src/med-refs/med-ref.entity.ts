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
  medType: string;          // 전문/일반의약품

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  medClass: string;         // e.g. 진해거담제

  // 나중에 array 로 바꿔야함 dur: string[]; array: true
  @Column({ type: 'varchar', nullable: true })
  contraindicateDUR: string;              // 병용금지 dur정보

  @Column({ type: 'varchar', nullable: true })
  durCombined: string;                    // 병용금기, 복합제, 병용금기 복합제 dur 성분 종합한 정보
}