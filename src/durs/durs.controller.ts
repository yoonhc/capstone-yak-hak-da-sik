import { Body, Controller, Post } from '@nestjs/common';
import { DursService } from './durs.service';
import { DURInfoDTO } from './dto/dur-info-dto';

@Controller('durs')
export class DursController {
    constructor(private readonly dursService: DursService) {}
    @Post()
    async getDURInfo(
        @Body() body: any
    ): Promise<DURInfoDTO[]> { 
        const ids: number[] = body.ids; // 본문에서 ids 배열 추출
        return this.dursService.getDURInfo(ids);
    }
}