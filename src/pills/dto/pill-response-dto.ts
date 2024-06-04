import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class PillResponseDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    medName?: string; // 약 이름

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    id?: number; // 약 품목번호

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    companyName?: string; // 업체명

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string; // 이미지 URL
}