import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * 이 dto 리스트를 최종적으로 client에 전달
 * 
 *  */
export class MedResponseDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;             // med-ref의 id에서

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string;    // med-ref의 companyName에서

    // image URL
    @ApiProperty()
    @IsString()
    image?: string;         // med-ref의 image에서

    // 약 분류명 e.g.진해거담제
    @ApiProperty()
    @IsString()
    medClass: string        // med-ref의 medClass에서

    // 전문/일반의약품
    @ApiProperty()
    @IsString()
    medType: string         // med-ref의 medType에서

    // 짧은 효과 설명 e.g.이 약은 설사, 체함, 묽은 변, 토사에 사용합니다.
    @ApiProperty()
    @IsString()
    effect: string          // med(e약은요)의 effect에서 아님 혹은 scrap한 페이지의 효능효과에서

    // 한눈에 보는 주의점, 중요사항
    @ApiProperty()
    @IsString()
    pillCheck: string       // 
    

    
    // 보관 방법 e.g. 밀봉용기, 실온(1～30℃)보관
    @ApiProperty()
    @IsString()
    howToStore: string      // med(e약은요)의 howToStore에서 아님 혹은 scrap한 페이지의 보관방법
}

{   
    "short_warning": "필첵 짧은 주의사항 // 필첵하세요.없을 수도",
    "상호작용":,
    "일반주의":,
    "복용":,
    "보관":,
    "상세"?,
}