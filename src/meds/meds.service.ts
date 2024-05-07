import { Injectable } from '@nestjs/common';
import { MedListDTO } from './dto/med-list-dto';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { OCRResultDTO } from './dto/ocr-result-dto';

@Injectable()
export class MedsService {

    /*
    * JSON 형식인 ocrResult로부터 text를 추출한다 (text: "단어\n단어\n단어")
    * 그 다음 text로부터 쓸데없는 단어를 제외하는 전처리를 거친다.
    */
    preprocessOCR(ocrResult: OCRResultDTO): string {
        const extractedText: string = ocrResult.text;

        // 아직 전처리는 미구현
        return extractedText;
    }

    // GPT 결과("약물1, 약물2, 약물3")를 가지고 MedListDTO를 만든다. 
    // 차후에 각각 약물이 맞는지(e.g. db에 있는지) verify하는 기능을 넣어야 할 듯
    refineGPTResult(gptResult: string): MedListDTO {
        const medicationsArray = gptResult.split(", ");
        const medListDTO: MedListDTO = new MedListDTO();
        medListDTO.medications = medicationsArray;
        return medListDTO;
    }

    // responsebody에 있는 ocrResult를 가지고 약물 리스트인 MedListDTO 반환
    async extractMeds(ocrResult: OCRResultDTO): Promise<MedListDTO> {
        const preprocessed: string = this.preprocessOCR(ocrResult);
        return this.refineGPTResult(await this.getGPTResponse(preprocessed));
    }

    // 전처리된 ocr결과를 GPT에 요청해 약물 리스트를 "약물1, 약물2, 약물3"
    async getGPTResponse(preprocessed: string): Promise<string> {
        const endpoint: string = 'https://caucapstone.openai.azure.com/';
        const azureKeyCredential: string = '3cabeb195a2e47dca214a7bdb64312a4';
        const deploymentId: string = 'MediProject';
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
            console.log(gptResult);
            return gptResult;
        } else {
            console.log("No message content found in the response.");
        }
    }

}