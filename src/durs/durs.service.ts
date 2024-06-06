import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DUR } from './dur.entity';
import { Repository } from 'typeorm';
import { MedRequestDTO } from 'src/meds/dto/med-request-dto';
import { DURInfoDTO } from './dto/dur-info-dto';
import { MedRefsService } from 'src/med-refs/med-refs.service';
import { every } from 'rxjs';
import { MedRef } from 'src/med-refs/med-ref.entity';

@Injectable()
export class DursService {
    constructor(
        @InjectRepository(DUR)
        private durRepository: Repository<DUR>,
        private medRefsService: MedRefsService,
    ) { }

    /**
     * id list로 부터 DURInfoDTO 반환
     * 알고리즘: 입력받은 id로 부터 MedRef repository 검색하여 durCombined 항목(병용금기, 복합제 포함 해당 약물이 가지고 있는 모든 dur 리스트)
     * 이 null이 아닌 list를 반환하여 MedRefLists라 하자
     * MedRefList의 모든 entity당 durCombined 리스트를 추출하여 dur이 key, 해당 dur을 가지고 있는 약 id를 value로 하는 Map을 만든다
     * 비슷하게 모든 entity당 병용금기 dur 요소(DUR 성분코드)를 추출하여 이를 원소로 가지고 있는 Set을 만든다.
     * Set의 모든 element에 대하여 DUR성분코드를 통해 검색하여 해당되는 dur entity 리스트를 반환. durs.csv의 각 row에 해당하는 entity임.
     * 각 entity에서 combinationDUR,contraindicateDUR,contraindicateCombinationDUR가 모두 Map에 존재하면
     * durcode, combinationDUR,contraindicateDUR,contraindicateCombinationDUR를 저장 - A라 하자
     * A에서 
     */
    async getDURInfo(ids: number[]): Promise<DURInfoDTO[]> {
        // returns MedRefs whose durCombined fields is not null
        const MedRefLists = await this.medRefsService.findNotNullDurByIds(ids);

        // Initialize the map
        const durElementMap = new Map<string, number[]>();
        // Initialize the set
        const contraindicateDURSet = new Set<string>();
        const durEntitySet = new Set<DUR>();

        // Initialize the map to store med names by ID
        const medNameMap = new Map<number, string>();

        // MedRefList의 모든 entity당 durCombined 리스트를 추출하여 dur이 key, 해당 dur을 가지고 있는 약 id를 value로 하는 Map을 만든다
        MedRefLists.forEach(async medRef => {
            // Store the medication name by ID
            medNameMap.set(medRef.id, medRef.medName);

            // Split the durCombined field into individual elements
            let durElements: string[] = [];
            let contraindicateDURElements: string[] = [];

            if (medRef.durCombined) {
                durElements = medRef.durCombined.split('/');
            }
            if (medRef.contraindicateDUR) {
                contraindicateDURElements = medRef.contraindicateDUR.split('/');
            }
            // Iterate over each durElement
            durElements.forEach(durElement => {
                // Trim any whitespace from durElement
                const trimmedElement = durElement.trim();

                // Check if the element already exists in the map
                if (durElementMap.has(trimmedElement)) {
                    // If it exists, append the current medRef ID to the list
                    durElementMap.get(trimmedElement).push(medRef.id);
                } else {
                    // If it doesn't exist, create a new list with the current medRef ID
                    durElementMap.set(trimmedElement, [medRef.id]);
                }
            });
            // 모든 entity당 병용금기 dur 요소(DUR 성분코드)를 추출하여 이를 원소로 가지고 있는 Set을 만든다.
            contraindicateDURElements.forEach(contraindicateDURElement => {
                // Trim any whitespace from contraindicateDURElement
                const trimmedElement = contraindicateDURElement.trim();
                // Add the element to the set
                contraindicateDURSet.add(trimmedElement);
            });
        });
        // loop through dur element in set
        for (const durCode of contraindicateDURSet) {
            const durEntities = await this.durRepository.find({
                where: {
                    durCode: durCode
                }
            });
            if (durEntities.length > 0) {   // durcode에 해당하는 entity가 존재한다면
                // Iterate over each DUR entity
                for (const durEntity of durEntities) {  // durEntity의 모든 null이 아닌 dur element가 Map에 존재하는지 판단
                    if (durElementMap.has(durEntity.contraindicateDUR)) {
                        let combinationDURs: string[] = [];
                        let contraindicateCombinationDURs: string[] = [];

                        if (durEntity.combinationDUR) {
                            combinationDURs = durEntity.combinationDUR.split('/');
                        }

                        if (durEntity.contraindicateCombinationDUR) {
                            contraindicateCombinationDURs = durEntity.contraindicateCombinationDUR.split('/');
                        }

                        // Now you can iterate over each array and add its elements to a set
                        const combinedDURSet = new Set<string>();

                        combinationDURs.forEach(dur => {
                            const trimmedDur = dur.trim();
                            if (trimmedDur !== '') { // Check if it's not an empty string
                                combinedDURSet.add(trimmedDur);
                            }
                        });

                        contraindicateCombinationDURs.forEach(dur => {
                            const trimmedDur = dur.trim();
                            if (trimmedDur !== '') { // Check if it's not an empty string
                                combinedDURSet.add(trimmedDur);
                            }
                        });
                        // 모든 복합제, 병용금기복합제가 다 map에 있으면 OK(병용금기 충돌일어난거임)
                        if (Array.from(combinedDURSet).every(dur => durElementMap.has(dur))) {
                            durEntitySet.add(durEntity);
                        }
                    }
                }
            }
        }
        console.log(durEntitySet)
        const result: DURInfoDTO[] = [];

        const seenItemGroups = new Set<string>(); // Initialize a set to keep track of seen itemGroups

        for (const durEntity of durEntitySet) {
            const uniqueItemGroups = this.findUniqueItemGroups(durEntity, durElementMap);

            for (const itemGroup of uniqueItemGroups) {
                // Sort the ids array to ensure order doesn't affect comparison
                const sortedIds = Array.from(itemGroup).sort((a, b) => a - b);

                // Retrieve the names for the sorted IDs from the medNameMap
                const medNames = sortedIds.map(id => medNameMap.get(id));

                // Create a string with names separated by "와"
                const namesString = medNames.join(" 와 ");

                const contraindicateReason = `${namesString}을(를) 병용하면 ${durEntity.contraindicateReason} 위험이 있습니다.`;
                // Check if the sorted itemGroup is already seen
                const sortedItemGroupKey = JSON.stringify(sortedIds);
                if (!seenItemGroups.has(sortedItemGroupKey)) {
                    const itemGroupArray = Array.from(itemGroup); // Convert Set<number> to number[]
                    result.push({
                        ids: itemGroupArray,
                        contraindicateReason: contraindicateReason
                    });
                    seenItemGroups.add(sortedItemGroupKey); // Add the sorted itemGroup to the set of seen itemGroups
                }
            }
        }
        return result;
    }

    findUniqueItemGroups(durEntity: DUR, durElementMap: Map<string, number[]>): Set<Set<number>> {
        const durSetArray: number[][] = [];
        const durCodeItem: number[] = durElementMap.get(durEntity.durCode);
        const contraindicateDURItem: number[] = durElementMap.get(durEntity.contraindicateDUR)
        let combinationDURs: string[] = []
        let contraindicateCombinationDURs: string[] = []

        if (durEntity.combinationDUR) {
            combinationDURs = durEntity.combinationDUR.split('/')
        }
        if (durEntity.contraindicateCombinationDUR) {
            contraindicateCombinationDURs = durEntity.contraindicateCombinationDUR.split('/')
        }
        if (durCodeItem) {
            durSetArray.push(durCodeItem);
        }
        if (contraindicateDURItem) {
            durSetArray.push(contraindicateDURItem);
        }
        if (combinationDURs.length > 0) {
            combinationDURs.forEach(item => {
                const durItem = durElementMap.get(item);
                if (durItem) {
                    durSetArray.push(durItem);
                }
            });
        }

        if (contraindicateCombinationDURs.length > 0) {
            contraindicateCombinationDURs.forEach(item => {
                const durItem = durElementMap.get(item);
                if (durItem) {
                    durSetArray.push(durItem);
                }
            });
        }

        const uniqueCombinations = new Set<Set<number>>();
        const generateCombinations = (currentCombination: Set<number>, index: number) => {
            if (index === durSetArray.length) {
                uniqueCombinations.add(new Set(currentCombination));
                return;
            }

            durSetArray[index].forEach(item => {
                currentCombination.add(item);
                generateCombinations(currentCombination, index + 1);
                currentCombination.delete(item);
            });
        };
        generateCombinations(new Set(), 0);
        return uniqueCombinations
    }
}