import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedListDTO } from './dto/med-list-dto';

@Controller('meds')
export class MedsController {
  constructor(private medsService: MedsService) { }
  @Post()
  async extractMeds(
    @Body()
    ocrResult: any
  ): Promise<MedListDTO> {
    return this.medsService.extractMeds(ocrResult);
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
