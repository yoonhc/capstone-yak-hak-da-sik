import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { PillsService } from './pills.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';
import { PillFilterDTO } from './dto/pill-filter-dto';
import { PillResponseDTO } from './dto/pill-response-dto';

@Controller('pills')
@ApiTags('pills')
export class PillsController {
    constructor(private pillsService: PillsService) {}

    // 내부적으로 약품 추가하는 로직이 없으면 get쓰는게 맞긴 한데 일단 post로
    @Post()
    @ApiOperation({ summary: 'Get Medicine Info from pill Info '})
    @ApiResponse({
        status:201,
        description: 'Successfully returned medicine info from pill info',
    })
    async getMedInfo(
        @Body()
        filter: PillFilterDTO,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<PillResponseDTO[]> {
        return await this.pillsService.getMedInfoPage(filter, page, limit);
    }
}
