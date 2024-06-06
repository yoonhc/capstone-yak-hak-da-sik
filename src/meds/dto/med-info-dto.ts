import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * 이 dto 리스트를 최종적으로 client에 전달
 *  */
export class MedInfoDTO {
    // e.g. 197400040
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;             // med-ref의 id에서

    // e.g. 베로나에스정,
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    medName: string;             // med-ref의  medName에서

    // e.g. 제이더블유중외제약(주)
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string;    // med-ref의 companyName에서

    // image URL e.g. https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1OZiugAPfPm
    @ApiProperty()
    @IsString()
    image?: string;         // med-ref의 image에서

    // 약 분류명 e.g.진해거담제
    @ApiProperty()
    @IsString()
    medClass: string        // med-ref의 medClass에서

    // 전문/일반의약품 e.g. 전문의약품
    @ApiProperty()
    @IsString()
    medType: string         // med-ref의 medType에서

    // 짧은 효과 설명 e.g.이 약은 설사, 체함, 묽은 변, 토사에 사용합니다.
    @ApiProperty()
    @IsString()
    effect?: string          // med(e약은요)의 effect에서 아님 혹은 scrap한 페이지의 효능효과에서

    // 필첵 같은 짧은 한눈에 보는 주의점, 중요사항 e.g. 어지럽거나 졸릴수 있으므로 기계조작은 피하세요
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    pillCheck?: string[]       // gpt통해 가져와야할 듯
    
    // 약물상호작용 e.g. 진정제와 병용하기 전에는 전문가와 상의하세요
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    medInteraction?: string[]  // gpt통해 가져와야할 듯

    // 기저질환주의 e.g. 간질환 환자의 경우 전문가에게 미리 알리세요
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    underlyingConditionWarn?: string[]

    //일반주의 e.g. 과도한 음주나 흡연은 삼가세요
    @ApiProperty()
    @IsArray()
    @IsString({ each:  true })
    genaralWarn?: string[]

    // 임산부주의 e.g. 임산부, 수유부는 투여하지 마세요
    @ApiProperty()
    @IsString()
    pregnancyWarn?: string

    // 음식상호작용 e.g. 이 약의 투여기간 동안 다량의 자몽주스를 섭취하는건 삼가세요.
    @ApiProperty()
    @IsString()
    foodInteraction?: string

    // 영양제상호작용 e.g. xxx영양제를 먹으면 아연 보충에 도움을 줄 수 있어요.
    @ApiProperty()
    @IsString()
    suppInteraction?: string

    // 복용 방법 e.g. 만 15세 이상은 1회 2캡슐씩, 1일 3회 식후 30분 이내에 복용합니다. 복용간격은 4시간 이상으로 합니다.
    @ApiProperty()
    @IsString()
    howToUse?: string   // e약은요 howToUse에서 혹은 scrap한 페이지?

    // 보관 방법 e.g. 밀봉용기, 실온(1～30℃)보관
    @ApiProperty()
    @IsString()
    howToStore?: string      // med(e약은요)의 howToStore에서 아님 혹은 scrap한 페이지의 보관방법

    // ------------------상세 설명 페이지---------------------//
    @ApiProperty()
    @IsString()
    detailedCriticalInfo?: string    //med(e약은요) criticalInfo 필드

    @ApiProperty()
    @IsString()
    detaileWarning?: string         // med(e약은요) warning 필드

    @ApiProperty()
    @IsString()
    detailedInteraction?: string    // med(e약은요) interaction 필드

    @ApiProperty()
    @IsString()
    detailedSideEffect?: string   // med(e약은요) sideEffect 필드
}