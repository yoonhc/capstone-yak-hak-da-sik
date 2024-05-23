import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { PillsService } from './pills.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Pill } from './pill.entity';
import { Med } from '../meds/med.entity';

@Controller('pills')
export class PillsController {
    constructor(private pillsService: PillsService) {}

    @Post()
    @ApiOperation({ summary: 'Get Medicine Info from pill Info '})
    @ApiResponse({
        status:201,
        description: 'Successfully returned medicine info from pill info',
    })
    async getMedInfo(
        @Body()
        pill: Pill,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<Med[]> {
        return await this.pillsService.getMedInfoPage(pill, page, limit);
    }
}
