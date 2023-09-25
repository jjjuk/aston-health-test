export const exitWithError = (err: string) => {
  console.error(err);
  process.exit(1);
};

type EnvTypes = 'string' | 'number';

type GetEnvReturnType<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : never;

export const getEnv = <T extends EnvTypes>(key: string, type: T) => {
  const value = process.env[key];
  if (!value) {
    exitWithError(`env variable ${key} is not set`);
  }
  if (type === 'number') {
    isNaN(Number(value)) &&
      exitWithError(`env variable ${key} is not a number, got '${value}'`);

    return Number(value) as GetEnvReturnType<T>;
  }
  if (type === 'string') return value as GetEnvReturnType<T>;
};
