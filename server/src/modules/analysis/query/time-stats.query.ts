import { IsEnum } from 'class-validator';

export enum TimeStatEnum {
  AVG = 'avg',
  MEDIAN = 'median',
  MODE = 'mode',
}

export class AnalysisTimeStatsQuery {
  @IsEnum(TimeStatEnum)
  stat: string;
}
