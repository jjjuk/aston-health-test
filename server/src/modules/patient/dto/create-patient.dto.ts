import { IsDateString, IsInt, Matches, Max, Min } from 'class-validator';
import { nameRegex } from 'src/utils/regex';

export class CreatePatientDto {
  @Matches(nameRegex)
  name: string;

  @Matches(nameRegex)
  surname: string;

  @Matches(nameRegex)
  patronymic: string;

  @IsDateString()
  birthDate: string;

  @IsInt()
  @Min(1)
  @Max(2)
  gender: number;
}
