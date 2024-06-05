import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedListDTO } from './dto/med-list-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { OCRResultDTO } from './dto/ocr-result-dto';
import { Med } from './med.entity';
import { MedRequestDTO } from './dto/med-request-dto';
import { MedResponseDTO } from './dto/med-response-dto';

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
    @ApiOperation({ summary: 'Get Med Informations and DUR Results(MedResponseDTO)' })
    @ApiResponse({
        status: 201,
        description: 'Successfully returned e-Med informations',
    })
    async getMedInfo(
        @Body()
        medList: MedRequestDTO
    ): Promise<MedResponseDTO> {
        // 서비스 만들어서 구현해야함
        return
    }
}
