import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserInterface {
  id: string;
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserInterface => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
