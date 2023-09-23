import dotenv from 'dotenv';
dotenv.config();

import { getEnv } from 'src/utils';

const cfg = {
  jwtSecret: getEnv('APP_SECRET', 'string'),
};

export default cfg;
