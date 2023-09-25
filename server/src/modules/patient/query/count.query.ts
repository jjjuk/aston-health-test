import { IsOptional } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean';

export class CountPatientQuery {
  @IsOptional()
  @ToBoolean()
  disease: boolean;

  @IsOptional()
  @ToBoolean()
  region: boolean;
}
