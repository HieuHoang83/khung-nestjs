import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser } from 'src/users/users.interface';
import {
  LOGINDTO,
  RefreshTokenDTO,
  RegisterUserSocialDto,
  RegisterUserSystemDto,
} from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Public() //public de ngan kiem tra token cho ham login
  @UseGuards(ThrottlerGuard) //ThrottlerGuard: ap dung limit call api /1 may trong 1 khoang tg
  @Throttle({ default: { limit: 3, ttl: 60000 } }) //ghi de limit mac dinh
  @ResponseMessage('user login ') //loi nhan khi call api success
  @UseGuards(LocalAuthGuard) // Xác thực tk ,mk đăng nhập có thành công hay k để trả về user trong request.user
  @Post('/loginByEmail')
  handleLogin(@Req() request, @Res({ passthrough: true }) response: Response) {
    return this.authservice.login(request.user, response);
  }

  @Public() //public de ngan kiem tra token cho ham login
  @ResponseMessage('user login ') //loi nhan khi call api success
  @UseGuards(ThrottlerGuard) //ThrottlerGuard: ap dung limit call api /1 may trong 1 khoang tg
  @Throttle({ default: { limit: 3, ttl: 60000 } }) //ghi de limit mac dinh
  @Post('/loginbySocial')
  handleLoginBySocial(
    @Body() loginDto: LOGINDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authservice.loginsocial(loginDto, response);
  }

  @Public()
  @ResponseMessage('register a  new user')
  @Post('/registerSystem')
  RegisterSystemUser(@Body() RegisterUserSystemDto: RegisterUserSystemDto) {
    return this.authservice.RegisterSystemUser(RegisterUserSystemDto);
  }

  @Public()
  @Post('/registerSocial')
  @ResponseMessage('register a  new user')
  RegisterSocialUser(@Body() registerUserSocialDto: RegisterUserSocialDto) {
    return this.authservice.RegisterSocialUser(registerUserSocialDto);
  }
  //k sd public vi k lay duoc user tu jwt truyen vao
  @ResponseMessage('get account')
  @Get('/account')
  GetByJWT(@User() user: IUser) {
    return {
      user: user,
    };
  }

  @Public()
  @ResponseMessage('reset access token')
  @Post('/refresh')
  GetByRefreshToken(
    @Body() refreshTokenDTO: RefreshTokenDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    //let refreshToken = request.cookies['refreshtoken'];
    return this.authservice.processNewToken(refreshTokenDTO, response);
  }

  @ResponseMessage('logout account')
  @Post('/logout')
  //@User de lay du lieu tu jwt truyen len
  Logout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authservice.logout(user, response);
  }
}
