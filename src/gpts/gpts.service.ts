import { Injectable } from '@nestjs/common';
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
        const endpoint: string = this.configService.get<string>('endpoint');
        const azureKeyCredential: string = this.configService.get<string>('azureKey');
        const deploymentId: string = this.configService.get<string>('deploymentID');
        const client: OpenAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureKeyCredential));
        // 말투도 신경써야할듯
        const prompt = [
            {
                role: "system",
                content: "You are a helpful assistant that summarizes medical information into a structured JSON format."
                    + "Make sure each field is in Korean, easy to understand and extremely short. Leave the field empty if there's no information. Reply in Korean"
            },
            {
                role: "system",
                content: `field properties:
                {
                    "effect": "Paraphrase the <effect> part from the provided text in one sentence",
                    "pillCheck": "The most important things the user should know about this medication based on the provided text. Save up to 2 items in an array of strings, e.g., ['장시간 눞거나 앉은 자세에서 일어나는 경우 천천히 일어나세요']",
                    "medInteraction": "Interactions with other medications. e.g., ['전문가와 상의없이 다른 감기약과 병용하지 마세요']",
                    "underlyingConditionWarn": "Warnings for users with underlying conditions, e.g., ['간질환 환자나 신장질환 환자의 경우 전문가에게 미리 알리세요']",
                    "genaralWarn": "General warnings regarding this medication, e.g., ['2주 정도 투여해도 증상 개선이 없는 경우 전문가와 상의하세요']",
                    "pregnancyWarn": "Warnings for pregnant persons, e.g., '임산부 및 임신 가능성이 있는 여성은 투여하지 마세요'",
                    "foodInteraction": "Interactions with foods, e.g., '다량의 자몽주스를 섭취하는 건 피하세요'",
                    "suppInteraction": "Warnings or advice regarding supplements, e.g., '아연이 부족해질 수 있으니 아연 관련 영양제를 먹으면 좋아요'"
                }`
            },
            {
                role: "user",
                content: "Medication Information: " + "<effect>:다음 질환에서의 객담배출곤란 : 급ㆍ만성기관지염, 기관지천식, 후두염, 부비동염, 낭성섬유증,<howToUse>:1. 급성질환\n성인 : 1회 200 mg 1일 3회\n소아 : 6 ～ 14세 1회 200 mg 1일 2회\n2. 만성질환\n성인 : 1회 200 mg 1일 2회\n소아 : 6 ～ 14세 1회 100 mg 1일 3회\n3. 낭성섬유증\n소아 : 6세 이상 1회 200 mg 1일 3회,<warning>:1. 다음과 같은 사람은 이 약을 복용하지 말 것.\n1) 이 약 또는 이 약의 구성성분에 과민반응 환자\n2) 위•십이지장궤양 환자\n3) 2세 미만 영아\n4) 이 약은 유당을 함유하고 있으므로, 갈락토오스 불내성(galactose intolerance), Lapp 유당분해효소 결핍증(Lapp lactase deficiency) 또는 포도당-갈락토오스 흡수장애(glucose-galactose malabsorption) 등의 유전적인 문제가 있는 환자에게는 투여하면 안 된다.\n2. 다음과 같은 사람은 이 약을 복용하기 전에 의사, 치과의사, 약사와 상의할 것.\n1) 임부 : 임부에 대한 적절한 연구가 없으므로 임부 또는 임신하고 있을 가능성이 있는 여성에는 반드시 필요한 경우에만 투여한다.\n2) 수유부 : 이 약이 모유로 분비되는지 알려지지 않았으나 많은 약들이 모유로 분비되므로 수유부에 투여할 경우에는 신중히 투여한다.\n4. 기타 이 약을 복용시 주의할 사항\n1) 경구용 항생물질(아목시실린, 세푸록심, 독시사이클린, 에리트로마이신, 치암페니콜)과 함께 복용시 항생물질의 약효를 감소시킬 수 있다(적어도 2시간의 간격을 두고 투여한다).\n2) 이 약의 용액에 다른 약물의 첨가는 피할 것.\n1. 다음과 같은 사람은 이 약을 복용하지 말 것.\n이 약 또는 이 약의 구성성분에 과민반응 환자\n4. 기타 이 약을 복용시 주의할 사항\n1) 소화기계 : 가벼운 취기(유황취)(5 %이상), 때때로 구역, 구토, 식욕부진 등이 나타날 수 있다.\n2) 기타 : 드물게 혈담, 오한, 발열, 비루, 구내염, 졸음, 흉부압박감, 기관 및 기관지에 대한 자극이 나타날 수 있다.\n3) 액화된 기관지 분비물이 증량되는 경우가 있으므로 관찰을 충분히 하고, 자연적인 객출이 곤란한 경우에는 기계적 흡인 또는 체위변환 등 적절한 처치를 한다.\n4) 항생물질과의 혼합에 의해 불활성화되는 일이 많으므로, 항생물질과 병용할 필요가 있는 경우에는 각각 흡입하든가 또는 항생물질을 주사 또는 경구투여한다.\n5) 주사제 또는 점안제로는 투여하지 않는다.\n6) 분무요법후 안면 마스크가 얼굴에 밀착되는 수가 있으나 물로 세척하면 쉽게 떨어진다.\n7) 일반적으로 고령자는 생리기능이 저하되어 있으므로 환자의 상태를 관찰하는 등 신중히 투여한다."
            },
            {
                role: "user",
                content: `Output format:
                {
                  "effect": "",
                  "pillCheck": [],
                  "medInteraction": [],
                  "underlyingConditionWarn": [],
                  "genaralWarn": [],
                  "pregnancyWarn": "",
                  "foodInteraction": "",
                  "suppInteraction": ""
                }`
            }
        ];
        const response = await client.getChatCompletions(deploymentId, prompt, {
            temperature: 0.0,
            // responseFormat: { "type": "json_object" },
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