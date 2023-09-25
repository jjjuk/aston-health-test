import { getEnv } from 'src/utils';

const cfg = {
  jwtSecret: getEnv('APP_SECRET', 'string'),
  port: getEnv('PORT', 'number'),
};

export default cfg;
