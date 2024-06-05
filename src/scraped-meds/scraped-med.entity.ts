import { Entity, PrimaryColumn } from "typeorm";

@Entity('scraped-meds')
export class ScrapedMed {
  @PrimaryColumn({ type: 'int', width: 9 })
  id: number;
}