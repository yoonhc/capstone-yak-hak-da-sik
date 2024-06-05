import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedSummary } from './med-summary.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';

@Injectable()
export class GptsService {
    constructor(
        @InjectRepository(MedSummary)
        private medSummaryRepository: Repository<MedSummary>,
        private readonly configService: ConfigService,
    ) {}

    // 전처리된 ocr결과를 GPT에 요청해 약물 리스트를 "약물1, 약물2, 약물3"
    async getGPTResponse(preprocessed: string): Promise<string> {
        const endpoint: string = this.configService.get<string>('endpoint');
        const azureKeyCredential: string = this.configService.get<string>('azureKey');
        const deploymentId: string = this.configService.get<string>('deploymentID');
        const client: OpenAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureKeyCredential));

        const prompt = [
            {
                role: "system",
                content: 'You are a helpful assistant that extract only medication from list of words seperated by \\n.'
                    + 'Please extract only medications in given text and provide the result.\n'
                    + 'This is an example format: "medication1, medication2, medication3"'
            },
            {
                role: "user",
                content: preprocessed
            },
        ];

        const response = await client.getChatCompletions(deploymentId, prompt, {
            maxTokens: 200,
            temperature: 0.0,
        });

        if (response.choices.length > 0 && response.choices[0].message) {
            const gptResult: string = response.choices[0].message.content;
            return gptResult;
        } else {
            console.log("No message content found in the response.");
        }
    }
}