import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResponseService } from '@/utils';
import { Request } from 'express';
// import { Observable } from 'rxjs';
// import { AuthMiddleware } from '@/middlewares';
import { ROLE_KEY } from '@/decorators';
import { Roles } from '@/enums';

export type AuthUserType = {
  id: string;
  role: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly responseServices: ResponseService,
    private reflector: Reflector,
  ) {}
  matchRoles(roles: Roles[], userRole: Roles) {
    return roles.some((role) => {
      if (role === Roles.ALL) {
        return true;
      }
      return role === userRole;
    });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      throw new UnauthorizedException(
        this.responseServices.errorResponse({
          success: false,
          data: null,
          statusCode: 401,
          message: 'Unauthorized',
        }),
      );
    }
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as unknown as AuthUserType;
    if (!user) {
      throw new UnauthorizedException(
        this.responseServices.errorResponse({
          success: false,
          data: null,
          statusCode: 401,
          message: 'Unauthorized',
        }),
      );
    }

    if (!this.matchRoles(requiredRoles, user.role as Roles)) {
      throw new UnauthorizedException(
        this.responseServices.errorResponse({
          success: false,
          data: null,
          statusCode: 401,
          message: 'Unauthorized',
        }),
      );
    }
    return true;
  }
}
