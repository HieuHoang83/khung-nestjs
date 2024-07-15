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
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  //public de ngan kiem tra token cho ham login
  @Public()
  @ResponseMessage('user login ')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  //@User de lay du lieu tu jwt truyen len
  handleLogin(@Req() request, @Res({ passthrough: true }) response: Response) {
    return this.authservice.login(request.user, response);
  }

  @Public()
  @ResponseMessage('register a  new user')
  @Post('/register')
  RegisterUser(@Body() registerUserdto: RegisterUserDto) {
    return this.authservice.RegisterUser(registerUserdto);
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
  @ResponseMessage('get user by refreshToken')
  @Get('/refresh')
  GetByRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    let refreshToken = request.cookies['refreshtoken'];

    return this.authservice.processNewToken(refreshToken, response);
  }

  @ResponseMessage('logout account')
  @Post('/logout')
  Logout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authservice.logout(user, response);
  }
}
