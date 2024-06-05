import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedRef } from './med-ref.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class MedRefsService {
    constructor(
        @InjectRepository(MedRef)
        private medRefRepository: Repository<MedRef>,
    ) {}

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
        const medRef = await this.medRefRepository.findOne({
            where: { medName: ILike(`%${medName}%`) },
            order: { medName: 'ASC' },
        });

        if (!medRef) {
            throw new NotFoundException(`No matching MedRef found for medName: ${medName}`);
        }
        return medRef;
    }

    /** 
     * 위의 findBestNMatch하기 전 약품 이름 정제
     * 앞에 괄호로 시작하는 경우 e.g.(임부금기)약품명 괄호 제거
     * 뒤에 괄호 열렸는데 길어서 끊기는 경우 세토펜8시간이알서방정(아... 의 경우 괄호 뒤 제거
     * 밀리그램, 그램, 그람, 밀리그람. mg, g, 아이유, IU등 이런거 통일해서 혹은 바꿔가며 검색
     * 위의 예 말고 다양한 상황 고려해야함
    */
    processMedNameBeforeSearch(medName: string): string {
        return
    }

    // Method to find a MedRef by ID
    async findOneById(id: number): Promise<MedRef> {
        const medRef = await this.medRefRepository.findOne({ where: { id } });
        if (!medRef) {
            throw new NotFoundException(`MedRef with ID ${id} not found`);
        }
        return medRef;
    }

}