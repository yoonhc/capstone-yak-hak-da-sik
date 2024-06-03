import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

/**
 * 낱알식별정보 필터 DTO
 * 아직 장축, 두께 등을 넣지는 않았지만 향후에 추가 가능
 */
export class PillFilterDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    drugShape?: string;      // 모양

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    colorClass1?: string;    // 색상 앞

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    colorClass2?: string;    // 색상 뒤

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lineFront?: string;      // 분할선 앞 

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lineBack?: string;       // 분할선 뒤

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    formCodeName?: string;   // 제형 (정제, 경질, 연질...)

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lengLongMin: number; // 최소 장축 길이

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lengLongMax: number; // 최대 장축 길이

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lengShortMin: number; // 최소 단축 길이

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lengShortMax: number; // 최대 단축 길이

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    thickMin: number; // 최소 두께

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    thickMax: number; // 최대 두께
}