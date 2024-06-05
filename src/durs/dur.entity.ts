import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('DURs')
export class DUR {
  @PrimaryColumn({ type: 'int', width: 9 })
  id: number;

  @Column({
    type: 'enum',
    enum: ['단일', '복합'],
    nullable: false,
  })
  durCombinationType: string;             // 단일/복합

  @Column({ type: 'varchar', length: 7, nullable: false })
  durCode: string;                        // DUR성분코드	

  @Column({ type: 'varchar', length: 63, nullable: true })
  combinationDUR: string;                 // 복합제

  @Column({
    type: 'enum',
    enum: ['단일', '복합'],
    nullable: true,
  })
  contraindicateCombinationType: string;  // 병용금기단일/복합

  @Column({ type: 'varchar', length: 7, nullable: false })
  contraindicateDUR: string;              // 병용금기DUR성분코드

  @Column({ type: 'varchar', length: 63, nullable: true })
  contraindicateCombinationDUR: string;   // 병용금기복합제

  @Column({ type: 'varchar', length: 255, nullable: true })
  contraindicateReason: string;           // 병용금기내용/이유
}