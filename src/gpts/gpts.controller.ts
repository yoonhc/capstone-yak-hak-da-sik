import { Body, Controller, Post } from '@nestjs/common';
import { GptsService } from './gpts.service';
import { text } from 'stream/consumers';
import { GPTSummaryDTO } from './dto/gpt-summary-dto';

@Controller('gpts')
export class GptsController {
    constructor(private readonly gptService: GptsService) { }

    @Post()
    async getScrapedMeds(
        @Body()
        textToSummarize: string
    ): Promise<GPTSummaryDTO> {
        console.log(textToSummarize)
        return this.gptService.gptSummarizeMeds(textToSummarize);
    }
}
