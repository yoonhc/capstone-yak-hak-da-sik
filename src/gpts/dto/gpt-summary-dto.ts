import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class GPTSummaryDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  effect: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pillCheck: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medInteraction: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  underlyingConditionWarn: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genaralWarn: string[];

  @ApiProperty()
  @IsArray()
  @IsString()
  @IsOptional()
  pregnancyWarn: string;

  @ApiProperty()
  @IsArray()
  @IsString()
  @IsOptional()
  foodInteraction: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  suppInteraction: string;
}
