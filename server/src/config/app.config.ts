import { getEnv } from 'src/utils';
import * as dotenv from 'dotenv';
dotenv.config && dotenv.config();

const cfg = {
  jwtSecret: getEnv('APP_SECRET', 'string'),
  port: getEnv('PORT', 'number'),
};

export default cfg;
