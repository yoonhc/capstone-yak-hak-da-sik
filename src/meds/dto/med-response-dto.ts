import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { MedInfoDTO } from "./med-info-dto";

export class MedResponseDTO {
    @ApiProperty()
    @IsArray()
    medInfos?: MedInfoDTO[];

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    durResult?: string[];
}