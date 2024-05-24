import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedListDTO } from './dto/med-list-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { OCRResultDTO } from './dto/ocr-result-dto';
import { Med } from './med.entity';

@Controller('meds')
@ApiTags('meds')
export class MedsController {
    constructor(private medsService: MedsService) { }
    @Post('extract')
    @ApiOperation({ summary: 'Extract Medicatrions from OCR Result' })
    @ApiResponse({
        status: 201,
        description: 'It will return extracted medications in the response',
    })
    async extractMeds(
        @Body()
        ocrResult: OCRResultDTO
    ): Promise<MedListDTO> {
        return await this.medsService.extractMeds(ocrResult);
    }

    @Post('get-info')
    @ApiOperation({ summary: 'Get e-Med Information from MedListDTO' })
    @ApiResponse({
        status: 201,
        description: 'Successfully returned e-Med informations',
    })
    async getMedInfo(
        @Body()
        medList: MedListDTO
    ): Promise<Med[]> {
        // return await this.medsService.handleOCR(ocrResult);
        return await this.medsService.getMedInfoList(medList);
    }
}
