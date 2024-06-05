import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";

export class MedRequestDTO {
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    medications?: string[];

    @ApiProperty()
    @IsArray()
    @IsInt({ each: true })
    currentMedications?: number[];
}