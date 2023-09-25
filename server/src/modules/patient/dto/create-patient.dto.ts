import { IsDateString, IsInt, Max, Min } from 'class-validator';
import { IsValidName } from 'src/common/decorators/valid-name.decorator';

export class CreatePatientDto {
  @IsValidName()
  name: string;

  @IsValidName()
  surname: string;

  @IsValidName()
  patronymic: string;

  @IsDateString()
  birthDate: string;

  @IsInt()
  @Min(1)
  @Max(2)
  gender: number;
}
