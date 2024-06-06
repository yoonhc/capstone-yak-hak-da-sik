import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedSummary } from './med-summary.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import { GPTSummaryDTO } from './dto/gpt-summary-dto';

@Injectable()
export class GptsService {
    constructor(
        @InjectRepository(MedSummary)
        private medSummaryRepository: Repository<MedSummary>,
        private readonly configService: ConfigService,
    ) { }
    async gptSummarizeMeds(textToSummarize: string): Promise<GPTSummaryDTO> {
        // const endpoint = 'https://cap4o.openai.azure.com/';
        const endpoint: string = this.configService.get<string>('endpoint');
        // const azureKeyCredential = 'f2c8e7826b47459c8fc7156159410738';
        const azureKeyCredential: string = this.configService.get<string>('azureKey');
        // const deploymentId = 'capstone';
        const deploymentId: string = this.configService.get<string>('deploymentID');
        const client: OpenAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureKeyCredential));
        // 말투도 신경써야할듯
        const prompt = [
            {
                role: "system",
                content: "You are a helpful assistant designed to  summarize medical information into a structured JSON format."
                    + "Make sure each field is easy to understand and really short. Leave the field empty if there's no information. Reply in Korean"
            },
            {
                role: "system",
                content: `field properties:
                {
                    "effect": "Paraphrase the <effect> part from the provided text in one sentence",
                    "pillCheck": "The most important things the user should know about this medication based on the provided text. Save up to 2 items in an array of strings, e.g., ['장시간 눞거나 앉은 자세에서 일어나는 경우 천천히 일어나세요']",
                    "medInteraction": "Interactions with other medications. e.g., ['전문가와 상의없이 다른 감기약과 병용하지 마세요']",
                    "underlyingConditionWarn": "Warnings for users with underlying conditions, e.g., ['간질환 환자나 신장질환 환자의 경우 전문가에게 미리 알리세요']",
                    "foodInteraction": "Interactions with foods, e.g., '다량의 자몽주스를 섭취하는 건 피하세요'",
                    "suppInteraction": "Warnings or advice regarding supplements, e.g., '아연이 부족해질 수 있으니 아연 관련 영양제를 먹으면 좋아요'"
                }`
            },
            {
                role: "user",
                content: "Medication Information: " + textToSummarize
            },
            {
                role: "user",
                content: `Output format:
                {
                  "effect": "",
                  "pillCheck": [],
                  "medInteraction": [],
                  "underlyingConditionWarn": [],
                  "foodInteraction": "",
                  "suppInteraction": ""
                }`
            }
        ];
        const response = await client.getChatCompletions(deploymentId, prompt, {
            temperature: 0.0,
            responseFormat: { "type": "json_object" },
        });

        if (response.choices.length > 0 && response.choices[0].message) {
            const gptResult: string = response.choices[0].message.content;
            console.log(gptResult)
            const summary = new GPTSummaryDTO();

            try {
                const parsedResult = JSON.parse(gptResult);

                try {
                    summary.effect = parsedResult.effect;
                } catch (error) {
                    console.log("Error parsing 'effect':", error);
                }

                try {
                    summary.pillCheck = parsedResult.pillCheck;
                } catch (error) {
                    console.log("Error parsing 'pillCheck':", error);
                }

                try {
                    summary.medInteraction = parsedResult.medInteraction;
                } catch (error) {
                    console.log("Error parsing 'medInteraction':", error);
                }

                try {
                    summary.underlyingConditionWarn = parsedResult.underlyingConditionWarn;
                } catch (error) {
                    console.log("Error parsing 'underlyingConditionWarn':", error);
                }

                try {
                    summary.genaralWarn = parsedResult.genaralWarn;
                } catch (error) {
                    console.log("Error parsing 'genaralWarn':", error);
                }

                try {
                    summary.pregnancyWarn = parsedResult.pregnancyWarn;
                } catch (error) {
                    console.log("Error parsing 'pregnancyWarn':", error);
                }

                try {
                    summary.foodInteraction = parsedResult.foodInteraction;
                } catch (error) {
                    console.log("Error parsing 'foodInteraction':", error);
                }

                try {
                    summary.suppInteraction = parsedResult.suppInteraction;
                } catch (error) {
                    console.log("Error parsing 'suppInteraction':", error);
                }
                return summary;
            } catch (error) {
                console.log("Error parsing JSON from GPT response:", error);
                return summary; // Return partial summary if JSON parsing fails partially
            }
        } else {
            console.log("No message content found in the response.");
            return null;
        }
    }

    // 전처리된 ocr결과를 GPT에 요청해 약물 리스트를 "약물1, 약물2, 약물3"
    async gptExtractMeds(preprocessed: string): Promise<string> {
        const endpoint: string = this.configService.get<string>('endpoint');
        const azureKeyCredential: string = this.configService.get<string>('azureKey');
        const deploymentId: string = this.configService.get<string>('deploymentID');
        const client: OpenAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureKeyCredential));

        const prompt = [
            {
                role: "system",
                content: 'You are a helpful assistant that extract only medication from list of words seperated by \\n.'
                    + 'Please extract only medications in given text and provide the result.\n'
                    + 'This is an example format: "medication1 (ingredient1), medication2, medication3(ingredient3)"'
                    + 'Ensure to maintain accuracy and completeness in the extraction process.'
                    + 'If there is a parenthesis right after what you recognize as a drug, it is likely to be an ingredient name, so be sure to include it.'
                    + 'If there is a word that ends in ‘정’, it is likely to be a drug, so pay attention to this.'
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
    async getMedSummaryByID(medID: number): Promise<MedSummary> {
        const found = await this.medSummaryRepository.findOne({
            where: {
                id: medID,
            }
        })
        if (!found) {
            throw new NotFoundException(`Can't find GPT-info with id ${medID}`);
        }
        return found;
    }
}