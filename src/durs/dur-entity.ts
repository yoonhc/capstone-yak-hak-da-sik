import { Entity, PrimaryColumn } from "typeorm";

@Entity('durs')
export class DUR {
@PrimaryColumn({ type: 'int', width: 9 })
  id: number;
}