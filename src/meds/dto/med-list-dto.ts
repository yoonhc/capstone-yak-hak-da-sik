import { IsArray, IsString } from "class-validator";

export class MedListDTO {
    @IsArray()
    @IsString()
    medications?: string[];
}