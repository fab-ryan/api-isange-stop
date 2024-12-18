import { SetMetadata } from '@nestjs/common';
import { Roles as Role } from '@/enums';

export const ROLE_KEY = 'role';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
