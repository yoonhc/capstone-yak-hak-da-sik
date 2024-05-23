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
    @Post()
    @ApiOperation({ summary: 'Extract Medicatrions from OCR Result' })
    @ApiResponse({
        status: 201,
        description: 'It will return extracted medications in the response',
    })
    async extractMeds(
        @Body()
        ocrResult: OCRResultDTO
    ): Promise<MedListDTO> {
        // return await this.medsService.handleOCR(ocrResult);
        return await this.medsService.extractMeds(ocrResult);
    }

    @Post('eMedInfo')
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
    /*
    @Get()
    async gptresponse(): Promise<MedListDTO> {
      try {
        // Call the async service method
        await this.medsService.getGPTResponse();
        return {};
      } catch (error) {
        // Handle errors
        throw new HttpException('Failed to extract medications', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
    }
    */
}
