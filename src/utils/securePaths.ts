import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const securePaths: RouteInfo[] = [
  {
    path: 'users',
    method: RequestMethod.GET,
  },
  {
    path: 'auth/change-password',
    method: RequestMethod.POST,
  },
  {
    path: 'user/getUserById',
    method: RequestMethod.GET,
  },
];
