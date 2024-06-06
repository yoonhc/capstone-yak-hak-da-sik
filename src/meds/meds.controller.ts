import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedListDTO } from './dto/med-list-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { OCRResultDTO } from './dto/ocr-result-dto';
import { Med } from './med.entity';
import { MedRequestDTO } from './dto/med-request-dto';
import { MedResponseDTO } from './dto/med-response-dto';
import { MedInfoDTO } from './dto/med-info-dto';

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

    @Post('get-one')
    @ApiOperation({ summary: 'Get Med Information' })
    @ApiResponse({
        status: 201,
        description: 'Successfully returned e-Med informations',
    })
    async getMedInfo(
        @Body() body: any
    ): Promise<MedInfoDTO> {
        // 서비스 만들어서 구현해야함
        const id: number = body.id;
        return await this.medsService.getOneMed(id);
    }

    @Post('get-info')
    @ApiOperation({ summary: 'Get Med Informations and DUR Results(MedResponseDTO)' })
    @ApiResponse({
        status: 201,
        description: 'Successfully returned e-Med informations',
    })
    async getMedsInfo(
        @Body()
        medList: MedRequestDTO
    ): Promise<MedResponseDTO> {
        // 서비스 만들어서 구현해야함
        return await this.medsService.getMedResponse(medList);
    }
}
