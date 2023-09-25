import { IsDateString, IsOptional, IsString, Min } from 'class-validator';

export class CreateAnalysisDto {
  @Min(1)
  patientId: number;

  @IsString()
  lab: string;

  @IsDateString()
  collectedAt: string;

  @IsOptional()
  @IsDateString()
  completedAt: string;

  // @IsOptional()
  // @IsDateString()
  // completedIn: string;

  @IsOptional()
  @IsString()
  result: string;
}
