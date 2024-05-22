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
    @ApiOperation({ summary: 'Return Brief Medicine Info from OCR Result' })
    @ApiResponse({
        status: 201,
        description: 'It will return brief informations about extracted medications from OCR in the response',
    })
    async extractMeds(
        @Body()
        ocrResult: OCRResultDTO
    ): Promise<Med[]> {
        return await this.medsService.handleOCR(ocrResult);
        // return await this.medsService.extractMeds(ocrResult);
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
