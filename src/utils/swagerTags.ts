import { TagObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const swagerTags: TagObject[] = [
  {
    name: 'Users',
    description: 'Users module with all operations',
  },
  {
    name: 'Auth',
    description: 'Auth module with all operations',
  },
];
