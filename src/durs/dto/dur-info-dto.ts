import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";

export class DURInfoDTO {
    // e.g. {197400040, 201920011, 200730232}
    @ApiProperty()
    @IsInt({ each: true })
    @IsArray()
    ids: number[];              // 충돌되는 약의 짝. 3개 이상이 함께 병용금기가 될 수도 있다

    @ApiProperty()
    @IsString()
    contraindicateReason: string;        // 병용금기 이유 A와 B을(를) 같이 먹으면 무슨 무슨 이유 떄문에 안된다.
}