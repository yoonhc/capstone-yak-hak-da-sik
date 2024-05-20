import { Entity, PrimaryColumn } from "typeorm";

/* 낱알 식별 정보를 저장하는 entity
** 이 db를 가지고 사용자가 색상, 장축 등 정보 체크하면 그에 맞는 약을 필터링 해준다
*/

@Entity('pills')
export class Pill{
    @PrimaryColumn()
    id: number;
}
