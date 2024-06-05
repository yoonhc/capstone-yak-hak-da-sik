import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { MedInfoDTO } from "./med-info-dto";
import { DURInfoDTO } from "src/durs/dto/dur-info-dto";

export class MedResponseDTO {
    @ApiProperty()
    @IsArray()
    medInfos?: MedInfoDTO[];

    @ApiProperty()
    @IsArray()
    durInfos?: DURInfoDTO[];
}