import { Column, Entity, PrimaryColumn } from "typeorm";

/* 낱알 식별 정보를 저장하는 entity
** 이 db를 가지고 사용자가 색상, 장축 등 정보 체크하면 그에 맞는 약을 필터링 해준다
*/

@Entity('pills')
export class Pill{
    @PrimaryColumn()
    id: number; // 품목일련번호

    @Column({ type: "text", nullable: true })
    medName: string; // 의약품 이름

    @Column({ type: "text", nullable: true })
    companyName: string; // 업체 이름

    @Column({ type: "text", nullable: true })
    drugShape: string; // 약 모양

    @Column({ type: "text", nullable: true })
    image: string; // 이미지
    
    @Column({ type: "text", nullable: true })
    colorClass1: string; // 색상 앞

    @Column({ type: "text", nullable: true })
    colorClass2: string; // 색상 뒤

    @Column({ type: "text", nullable: true })
    lineFront: string; // 분할선 앞

    @Column({ type: "text", nullable: true })
    lineBack: string; // 분할선 뒤

    @Column({ type: "double precision", nullable: true })
    lengLong: number; // 장축 길이

    @Column({ type: "double precision", nullable: true })
    lengShort: number; // 단축 길이

    @Column({ type: "double precision", nullable: true })
    thick: number; // 두께

    @Column({ type: "text", nullable: true })
    formCodeName: string; // 제형
}
