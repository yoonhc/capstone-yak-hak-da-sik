import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('med-summaries')
export class MedSummary {
  @PrimaryColumn({ type: 'int', width: 9 })
  id: number;

  // 짧은 효과 설명
  @Column({ type: "text", nullable: true })
  effect: string;

  // 필첵 같은 짧은 한눈에 보는 주의점
  @Column({ type: "simple-array", nullable: true })
  pillCheck: string
  
  // 약물상호작용
  @Column({ type: "simple-array", nullable: true })
  medInteraction: string

  @Column({ type: "simple-array", nullable: true })
  underlyingConditionWarn: string

  @Column({ type: "simple-array", nullable: true })
  genaralWarn: string

  @Column({ type: "text", nullable: true })
  pregnancyWarn: string

  @Column({ type: "text", nullable: true })
  foodInteraction: string

  @Column({ type: "text", nullable: true })
  suppInteraction: string

  /* 복용방법까지 gpt한테 부탁하면 너무 많은 것 같고
    e약은요에 있으면 쓰고 없으면 걍 null로 반환하는게 맞을듯
  @Column({ type: "text", nullable: true })
  howToUse: string
  */
}