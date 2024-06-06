import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsNumber } from "class-validator";

export class MedListDTO {
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    medications?: string[];

    @ApiProperty()
    @IsArray()
    @IsNumber()
    currentMedications?: number[];
}