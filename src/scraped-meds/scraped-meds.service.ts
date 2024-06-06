import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ScrapedMed } from './scraped-med.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { MedSummary } from 'src/gpts/med-summary.entity';

@Injectable()
export class ScrapedMedsService {
    constructor(
        @InjectRepository(ScrapedMed)
        private scrapedMedRepository: Repository<ScrapedMed>,
    ) { }

    async getSavedScrap(medID: number): Promise<ScrapedMed> {
        const found = await this.scrapedMedRepository.findOne({
            where: {
                id: medID,
            }
        })

        if (!found) {
            throw new NotFoundException(`Can't find scraped info with id ${medID}`);
        }
        
        return found;
    }

    async getScrapedMeds(id: number): Promise<ScrapedMed> {
        try {
            const url = "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetailCache?cacheSeq="
            + id + "aupdateTs2024-05-05%15:42:27.0b"
            // Specify request headers
            const config: AxiosRequestConfig = {
                headers: {
                    'Accept': 'text/html', // 이거 안하면 JSON 반환할 떄도 있어서 에러생김
                },
            };
            // Make the request with specified headers
            const { data } = await axios.get(url, config);
            
            const $ = cheerio.load(data);

            const effectInfo = this.extractEffectInfo($)
            const howToUseInfo = this.extractHowToUseInfo($)
            const warningInfo = this.extractWarningInfo($)
            const howToStoreInfo= this.extractHowToStoreInfo($)

            // Ensure effectInfo and howToStoreInfo are not empty strings
            // There are cases where response is 200 but all the fields are empty string
            if (!effectInfo || !howToStoreInfo) {
                throw new HttpException(
                    'Required information missing: effectInfo or howToStoreInfo is empty',
                    HttpStatus.BAD_REQUEST,
                );
            }
            // Create a new ScrapedMed entity
            const scrapedMed = new ScrapedMed();
            scrapedMed.id = id;
            scrapedMed.effect = effectInfo;
            scrapedMed.howToUse = howToUseInfo;
            scrapedMed.warning = warningInfo;
            scrapedMed.howToStore = howToStoreInfo;

            await this.scrapedMedRepository.save(scrapedMed);
            return scrapedMed;
            
        } catch (error) {
            throw new HttpException(
                'Error fetching or parsing the HTML content',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private extractEffectInfo($: cheerio.CheerioAPI): string {
        try {
            const contentElement = $('div#_ee_doc');
    
            // Extract and format the text content
            let content = '';
    
            // Check if the content element exists
            if (contentElement.length) {
                // Find all direct child elements of the content element
                contentElement.children().each((_, element) => {
                    // Check if the current child element has class 'title'
                    if ($(element).hasClass('title')) {
                        content += $(element).text().trim() + '\n';
                        $(element).next('div').find('p.indent0').each((_, indent0) => {
                            content += $(indent0).text().trim() + '\n';
                        });
                    } else {
                        // Check if the current child element has class 'indent0'
                        if ($(element).hasClass('indent0')) {
                            content += $(element).text().trim() + '\n';
                        }
                    }
                });
            }
            return content.trim();
        } catch (error) {
            console.error('Error extracting effect information:', error.message);
            return ''; // Return an empty string or handle the error accordingly
        }
    }

    private extractHowToUseInfo($: cheerio.CheerioAPI): string {
        try {
            const contentElement = $('div#_ud_doc');

            // Extract and format the text content
            let content = '';
    
            // Check if the content element exists
            if (contentElement.length) {
                // Find all direct child elements of the content element
                contentElement.children().each((_, element) => {
                    // Check if the current child element has class 'title'
                    if ($(element).hasClass('title')) {
                        content += $(element).text().trim() + '\n';
                        $(element).next('div').find('p.indent0').each((_, indent0) => {
                            content += $(indent0).text().trim() + '\n';
                        });
                    } else {
                        // Check if the current child element has class 'indent0'
                        if ($(element).hasClass('indent0')) {
                            content += $(element).text().trim() + '\n';
                        }
                    }
                });
            }
            return content.trim();
        } catch (error) {
            console.error('Error extracting howToUse information:', error.message);
            return ''; // Return an empty string or handle the error accordingly
        }
    }

    private extractWarningInfo($: cheerio.CheerioAPI): string {
        try {
            const contentElement = $('div#_nb_doc');
    
            // Extract and format the text content
            let content = '';
    
            // Define an array of strings to match against the titles
            const warningStrings = [
                '다음과 같은 사람은 이 약을 복용하지 말 것',
                '다음과 같은 사람은 이 약을 복용하지 말것',
                '다음 환자에는 투여하지 말 것',
                '다음 경우에는 신중히 투여할 것',
                '이 약을 복용하는 동안 다음의 약(식품)을 복용하지 말 것',
                '이 약을 복용하는 동안 다음의 약을 복용하지 말 것',
                '다음과 같은 사람은 이 약을 복용하기 전에 의사, 치과의사, 약사와 상의 할 것',
                '다음과 같은 사람은 이 약을 복용하기 전에 의사, 치과의사, 약사와 상의할 것',
                '다음과 같은 경우 이 약의 복용을 즉각 중지하고 의사, 치과의사, 약사와 상의할 것. 상담 시 가능한 한 이 첨부문서를 소지할 것',
                '다음과 같은 경우 이 약의 복용을 즉각 중지하고 의사, 치과의사, 약사와 상의할 것. 상담시 가능한한 이 첨부문서를 소지할 것',
                '기타 이 약의 복용 시 주의사항',
                '기타 이 약을 복용시 주의할 사항',
                '경고',
                '부작용',
                '일반적 주의',
                '일반적인 주의',
                '상호작용',
                '상호 작용'
            ];
    
            // Loop through each title element and check if it contains any of the specified strings
            contentElement.find('p.title').each((_, titleElement) => {
                const titleText = $(titleElement).text().trim();
                if (warningStrings.some(warningString => titleText.includes(warningString))) {
                    // If the title contains any of the specified strings, extract its text content and its following elements
                    content += titleText + '\n';
                    $(titleElement).next('div').find('p.indent0').each((_, element) => {
                        content += $(element).text().trim() + '\n';
                    });
                }
            });
            return content.trim();
        } catch (error) {
            console.error('Error extracting warning information:', error.message);
            return ''; // Return an empty string or handle the error accordingly
        }
    }

    private extractHowToStoreInfo($: cheerio.CheerioAPI): string {
        try {
            // Select the table row that contains the "저장방법" (Storage Method)
            const storageMethodRow = $('div#scroll_07').find('th:contains("저장방법")').closest('tr');
            
            if (storageMethodRow.length === 0) {
                console.error('Storage Method row not found.');
                return '';
            }
    
            // Extract the content of the corresponding <td> element
            const storageMethodContent = storageMethodRow.find('td').text().trim();
    
            return storageMethodContent;
        } catch (error) {
            console.error('Error extracting storage method information:', error.message);
            return ''; // Return an empty string or handle the error accordingly
        }
    }

}