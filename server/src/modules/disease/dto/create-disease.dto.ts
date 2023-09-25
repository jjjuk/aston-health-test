import { IsDateString, Min, IsString } from 'class-validator';

export class CreateDiseaseDto {
  @Min(1)
  patientId: number;

  @IsDateString()
  diagnosedAt: string;

  @IsString()
  name: string;
}
