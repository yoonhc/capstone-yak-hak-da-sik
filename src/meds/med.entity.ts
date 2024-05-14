import { Column, Entity, PrimaryColumn } from "typeorm";

/* 이 db에 사용자에게 넘겨줄 약 종합 정보를 저장
** 처음에 e약은요 csv를 통해 채워놓을 수도 있을듯
** medsref와 primary key로 엮을지 고민중
** medsref와 엮으려면  e약은요 항목이 모두  medsref에 있어야함
** medsref에 이미지가 있는데 여기에 제품이미지도 넣을지 고민중
** nullable 설정도 해야함
** swagger setup도
*/

@Entity('meds')
export class Med {
    @PrimaryColumn()
    id: number;

    @Column({ type: "varchar" })
    companyName: string;

    @Column({ type: "varchar" })
    medName: string;

    @Column({ type: "text" })
    effect: string;

    @Column({ type: "text" })
    howToUse: string;

    @Column({ type: "text" })
    criticalInfo: string;

    @Column({ type: "text" })
    warning: string;

    @Column({ type: "text" })
    interaction: string;

    @Column({ type: "text" })
    sideEffect: string;

    @Column({ type: "text" })
    howToStore: string;
}