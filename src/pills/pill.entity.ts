import { Column, Entity, PrimaryColumn } from "typeorm";

/* 낱알 식별 정보를 저장하는 entity
** 이 db를 가지고 사용자가 색상, 장축 등 정보 체크하면 그에 맞는 약을 필터링 해준다
*/

@Entity('pills')
export class Pill{
    @PrimaryColumn()
    id: number;

    @Column({ type: "text", nullable: true })
    medName: string;

    @Column({ type: "text", nullable: true })
    drugShape: string;
    
    @Column({ type: "text", nullable: true })
    colorClass1: string;

    @Column({ type: "text", nullable: true })
    colorClass2: string;

    @Column({ type: "text", nullable: true })
    lineFront: string;

    @Column({ type: "text", nullable: true })
    lineBack: string;

    @Column({ type: "text", nullable: true })
    lengLong: string;

    @Column({ type: "text", nullable: true })
    lengShort: string;

    @Column({ type: "text", nullable: true })
    thick: string;

    @Column({ type: "text", nullable: true })
    formCodeName: string;
}
