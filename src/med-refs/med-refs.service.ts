import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedRef } from './med-ref.entity';
import { Like, ILike, In, Not, Repository } from 'typeorm';

@Injectable()
export class MedRefsService {
    constructor(
        @InjectRepository(MedRef)
        private medRefRepository: Repository<MedRef>,
    ) {}

    async findMatchesByName(medName: string, page: number, limit: number): Promise<MedRef[]> {
        const conditions = {
            where: { 
                medName: Like(`%${medName}%`) // medName 필드에 대해 부분 일치 검색
            },
            skip: (page - 1) * limit,
            take: limit
        };

        const [results] = await this.medRefRepository.findAndCount(conditions);
        return results;
    }

    async findBestMatchesByName(medNames: string[]): Promise<MedRef[]> {
        // string의 문자열들에 대해 db에서 검색
        // db에서 검색한 항목의 medName에 괄호가 존재할 경우, 괄호 안의 내용을 성분명으로 저장
        // 이후 등장하는 문자열들에 대해 이 성분명과 동일한지 검사
        // 만약 동일하다면, 성분명에 대해서는 검색하지 않음.
        // 찾은 정보들을 배열으로 반환. 

        // 이거 죽은 함수임 쓰지마
        const bestMatches: MedRef[] = [];
        const ingredientSet = new Set<string>();

        for (const medName of medNames) {
            try {
                if (ingredientSet.has(medName)) {
                    console.log(`Skipping ingredient name: ${medName}`);
                    continue;
                }

                const bestMatch = await this.findBestMatchByName(medName);
                const ingredientMatch = bestMatch.medName.match(/\((.*?)\)/);
                if (ingredientMatch) {
                    const ingredient = ingredientMatch[1];
                    ingredientSet.add(ingredient); // 성분명을 저장
                }

                bestMatches.push(bestMatch);
            } catch (e) {
                // NotFoundException을 무시하고 다음 항목으로 계속 진행
                console.warn(e.message);
            }
        }

        return bestMatches;
    }

    /**
     * 이름을 통해 제일 매칭이 잘되는 것 반환. 여기에 넣기 argument로 넣기 전에
     * 앞에 괄호로 시작하는 경우 e.g.(임부금기)약품명 괄호 제거
     * 뒤에 괄호 열렸는데 길어서 끊기는 경우 세토펜8시간이알서방정(아... 의 경우 괄호 뒤 제거
     * 밀리그램, 그램, 그람, 밀리그람. mg, g, 아이유, IU등 이런거 통일해서 혹은 바꿔가며 검색
     * 그리고 이 코드는 substring 일치하는 리스트중 오름차순 정렬해서 반환하는 건데 코드 수정해야 함
     * 예를 들어 아록솔정(암브록솔염산염), 록솔정(암브록솔염산염)이 있는데 록솔정을 입력하면
     * 오름차순과 관계없이 록솔정(암브록솔염산염)이 길이 대비 일치도가 높으니 록솔정(암브록솔염산염)을 반환해야함
     */
    async findBestMatchByName(medName: string): Promise<MedRef> {
        const medRefs = await this.medRefRepository.find({
            where: { medName: Like(`%${medName}%`) },
            order: { medName: 'ASC' },
        });

        if (!medRefs) {
            throw new NotFoundException(`No matching MedRef found for medName: ${medName}`);
        }
        
        let bestMatch: MedRef | null = null;
        let minDistance = Infinity;

        // 유사도로는 레벤슈타인 거리 사용
        const { default: leven } = await import('leven');

        for (const medRef of medRefs) {
            const distance = leven(medName, medRef.medName);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = medRef;
            }
        }

        if (!bestMatch) {
            throw new NotFoundException(`No suitable match found for medName: ${medName}`);
        }

        return bestMatch;
    }


    /** 
     * 위의 findBestNMatch하기 전 약품 이름 정제
     * 앞에 괄호로 시작하는 경우 e.g.(임부금기)약품명 괄호 제거
     * 뒤에 괄호 열렸는데 길어서 끊기는 경우 세토펜8시간이알서방정(아... 의 경우 괄호 뒤 제거
     * 밀리그램, 그램, 그람, 밀리그람. mg, g, 아이유, IU등 이런거 통일해서 혹은 바꿔가며 검색
     * 위의 예 말고 다양한 상황 고려해야함
    */
   // 이거 단위는 막상 GPT 돌리면 단위가 날아가는 경우가 많음
   // 게다가, 단위가 포함되어 있으면 대부분의 경우 이름이 잘림(너무 길어서). 단위 수까지 완벽하게 보장이 불가함.
   // 그럴 바엔 그냥 단위 전부 날리고 이름만 검색하는 것으로.
   // 당연히 앞뒤로 붙은 괄호는 다 날릴것
    async processMedNameBeforeSearch(medNames: string[]): Promise<string[]> {
        /**
         * 확인된 단위
         * 그램
         * 그람
         * 밀리그램
         * 밀리그람
         * mg
         * g
         * iu
         * 아이유
         */
        // 정규식으로 문자열 정제
        // 괄호 및 괄호 안의 내용 모두 삭제
        // 이거 비동기로 하면 안 됨 성분명 못 거름
        const units = [
            '그램', '그람', '밀리그램', '밀리그람', 'mg', 'g', 'iu', '아이유'
        ];
        const ingredients = new Set<string>();
        const results = [];

        for (const name of medNames) {
            let medName = name;
            let ingredientName = '';
    
            // 문자열 시작에서 바로 괄호가 시작되면 그 괄호를 제거
            medName = medName.replace(/^\([^)]*\)/, '');

            // 문자열 중간에서 열린 괄호 이후 닫힌 괄호가 없으면 그 부분을 제거
            medName = medName.replace(/\([^)]*$/, '');
    
            // 숫자 및 단위 제거
            units.forEach(unit => {
                const regex = new RegExp(`\\d*\\.?\\d+\\s*${unit}`, 'gi');
                medName = medName.replace(regex, '');
            });

            medName = medName.trim();
            console.log(`Checking:` + medName);
            if (medName.length === 0 || ingredients.has(medName)) {
                // 이미 처리된 성분명이거나 빈 문자열인 경우 스킵
                console.log(`Skipped ingredient: ${medName}`);
                continue;
            }

            try {
                // DB에서 가장 일치하는 약품 이름을 검색
                let bestMatch = await this.findBestMatchByName(medName);
                console.log(bestMatch);
                    // 괄호 안 내용 추출
                    const ingredientMatch = bestMatch.medName.match(/\((.*?)\)/);
                    if (ingredientMatch) {
                        const ingredient = ingredientMatch[1];
                        ingredients.add(ingredient); // 성분명을 Set에 추가
                    }
                    results.push(bestMatch.medName);
            } catch (e) {
                // 나오는 게 없으면 뒷쪽 괄호도 없애고 재검색
                try {
                    medName = medName.replace(/\(.*?\)/, '').trim();
                    let bestMatch = await this.findBestMatchByName(medName);
                    const ingredientMatch = bestMatch.medName.match(/\((.*?)\)/);
                    if (ingredientMatch) {
                        const ingredient = ingredientMatch[1];
                        ingredients.add(ingredient); // 성분명을 Set에 추가
                    }
                    results.push(bestMatch.medName);
                } catch (e) {
                    // 그래도 없으면 그냥 스킵
                    console.error(`No match found for ${medName}: ${e.message}`);
                    continue;
                }
            }
        }
    
        console.log(`Refined names: ${results}`);
        console.log(`Extracted ingredients: ${Array.from(ingredients)}`);
        return results;
    }

    // Method to find a MedRef by ID
    async findOneById(id: number): Promise<MedRef> {
        const medRef = await this.medRefRepository.findOne({ where: { id } });
        if (!medRef) {
            throw new NotFoundException(`MedRef with ID ${id} not found`);
        }
        return medRef;
    }

    async findNotNullDurByIds(ids: number[]): Promise<MedRef[]> {
        return this.medRefRepository.find({
          where: {
            id: In(ids),
            durCombined: Not(null),
          },
        });
      }
}