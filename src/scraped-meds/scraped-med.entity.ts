import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('scraped-meds')
export class ScrapedMed {
  @PrimaryColumn({ type: 'int', width: 9 })
  id: number;

  @Column({ type: "text", nullable: true })
  effect: string;

  @Column({ type: "text", nullable: true })
  howToUse: string;

  @Column({ type: "text", nullable: true })
  warning: string;

  @Column({ type: 'varchar', length: 127, nullable: true })
  howToStore: string;
}