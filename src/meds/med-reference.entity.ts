import { Entity, PrimaryColumn } from "typeorm";

/* 이 db는 업데이트 되지 않고 처음 csv/migragtion으로 세팅됨
** 이 db가 레퍼런스가 되어 처음 약 이름으로 품목기준코드(id)를 찾을 떄
** 이 db를 사용한다.
** 이 db에 낱알 사진도 포함되어 있음
** 나중에 dur 정보를 추가해서 넣을지 고민중
*/

@Entity('med_references')
export class MedReference{
    @PrimaryColumn()
    id: number;
}
