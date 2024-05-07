import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class MedListDTO {
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    medications?: string[];
}