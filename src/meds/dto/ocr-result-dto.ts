import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class OCRResultDTO {
    @ApiProperty()
    @IsString()
    readonly text: string;
}