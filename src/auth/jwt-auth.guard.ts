import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ADMIN_Role } from 'src/database/sample';
import { IS_PUBLIC_KEY } from 'src/decorators/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'token k hop le or khong co bear token ở header',
        )
      );
    }

    const targerMethod = request.method;
    const targetEnpoint = request.route?.path as string;
    const permissions = user?.permissions ?? [];
    console.log(targetEnpoint);

    //Check permission
    if (
      targetEnpoint.startsWith('/api/v1/auth') ||
      user?.role?.name === ADMIN_Role
    ) {
      return user;
    } else {
      let isExist = user.permissions.find((permission) => {
        return (
          permission.apiPath === targetEnpoint &&
          permission.method === targerMethod
        );
      });
      return user;
      // if (!isExist) {
      //   throw new ForbiddenException(
      //     'Bạn không có quyền truy cập đến method này',
      //   );
      // }
    }
  }
}
