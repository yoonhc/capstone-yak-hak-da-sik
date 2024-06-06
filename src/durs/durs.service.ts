import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DUR } from './dur.entity';
import { Repository } from 'typeorm';
import { MedRequestDTO } from 'src/meds/dto/med-request-dto';
import { DURInfoDTO } from './dto/dur-info-dto';
import { MedRefsService } from 'src/med-refs/med-refs.service';
import { every } from 'rxjs';

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
    async getDURINfo(ids: number[]): Promise<DURInfoDTO[]> {
        // returns MedRefs whose durCombined fields is not null
        const MedRefLists = await this.medRefsService.findNotNullDurByIds(ids)

        // Initialize the map
        const durElementMap = new Map<string, number[]>();
        // Initialize the set
        const contraindicateDURSet = new Set<string>();
        const durEntitySet = new Set<DUR>();

        // Iterate over each MedRef entity
        MedRefLists.forEach(async medRef => {
            // Split the durCombined field into individual elements
            const durElements = medRef.durCombined.split('/');
            const contraindicateDURElements = medRef.contraindicateDUR.split('/');

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

            // Iterate over each contraindicateDURElement
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
            if (durEntities.length > 0) {   // durcode에 해당하는 entity가 존재한다면(사실 항상 존재)
                // Iterate over each DUR entity
                for (const durEntity of durEntities) {  // durEntity의 모든 null이 아닌 dur element가 Map에 존재하는지 판단
                    if(durElementMap.has(durEntity.contraindicateDUR)){
                        const combinationDURs = durEntity.combinationDUR.split('/')
                        const contraindicateCombinationDURs = durEntity.combinationDUR.split('/')
                        if (combinationDURs.length > 0 && contraindicateCombinationDURs.length > 0) {
                            // Check if every element in combinationDURs is in the map
                            const allCombDURInMap = combinationDURs.every(dur => durElementMap.has(dur.trim()));
                            const allContrainDURInMap = combinationDURs.every(dur => durElementMap.has(dur.trim()));
                            if (allCombDURInMap && allContrainDURInMap) {
                                durEntitySet.add(durEntity)
                            }
                        } 
                    }
                }
            }
        }
        
        return
    }
}