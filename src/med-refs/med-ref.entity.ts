import { Entity, PrimaryColumn } from "typeorm";

@Entity('med_references')
export class MedReference{
    @PrimaryColumn()
    id: number;
}