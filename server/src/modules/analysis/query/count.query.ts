import { IsOptional } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean';

export class CountPatientQuery {
  @IsOptional()
  @ToBoolean()
  by_region: boolean;
}
