import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      //lay token tu request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_EXPIRE_SECRET'),
    });
  }

  async validate(payload: IUser) {
    //gan them permission cho req.user
    //req.user
    return {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    };
  }
}
