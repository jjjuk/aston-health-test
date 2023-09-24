import { SetMetadata } from '@nestjs/common';

export const DISABLE_AUTH_KEY = 'disableAuth';

export const NoGuards = () => SetMetadata(DISABLE_AUTH_KEY, true);
