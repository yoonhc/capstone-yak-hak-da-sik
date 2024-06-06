import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedRef } from './med-ref.entity';
import { ILike, In, Not, Repository } from 'typeorm';

@Injectable()
export class MedRefsService {
    constructor(
        @InjectRepository(MedRef)
        private medRefRepository: Repository<MedRef>,
    ) {}

    async findBestMatchesByName(medNames: string[]): Promise<MedRef[]> {
        // string의 문자열들에 대해 db에서 검색
        // db에서 검색한 항목의 medName에 괄호가 존재할 경우, 괄호 안의 내용을 성분명으로 저장
        // 이후 등장하는 문자열들에 대해 이 성분명과 동일한지 검사
        // 만약 동일하다면, 성분명에 대해서는 검색하지 않음.
        // 찾은 정보들을 배열으로 반환. 
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
            where: { medName: ILike(`%${medName}%`) },
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
    processMedNameBeforeSearch(medNames: string[]): string[] {
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
        const units = [
            '그램', '그람', '밀리그램', '밀리그람', 'mg', 'g', 'iu', '아이유'
        ];

        return medNames.map(medName => {
            // 공백 제거
            medName = medName.replace(/\(.*?\)/g, '');

            // 숫자 및 단위 제거
            units.forEach(unit => {
                const regex = new RegExp(`\\d*\\.?\\d+\\s*${unit}`, 'gi');
                medName = medName.replace(regex, '');
            });

            // 마지막으로 trim도 해주기
            medName = medName.trim();

            console.log(`검색 전 정제된 항목:${medName}`);

            return medName;
        });
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