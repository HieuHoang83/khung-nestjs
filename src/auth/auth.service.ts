import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Request, Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configserver: ConfigService,
  ) {}

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configserver.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configserver.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  };

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByemail(username);
    if (user && this.usersService.CheckUserpassword(pass, user.password)) {
      const userRole: any = user.role;
      const temp = await this.rolesService.findOne(userRole?._id.toString());

      return {
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: temp?.permissions ?? [],
      };
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };
    //create refresh token
    const refreshToken = await this.createRefreshToken(payload);
    //update refresh token in db
    await this.usersService.updateUserToken(user._id, refreshToken);

    response.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configserver.get<string>('JWT_REFRESH_EXPIRE')),
      secure: true, // set to true if your using HTTPS
    });
    return {
      access_token: this.jwtService.sign(payload),
      refreshToken: refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  async RegisterUser(registerUserdto: RegisterUserDto) {
    let newUser: any = await this.usersService.register(registerUserdto);

    return {
      _id: newUser?._id,
      createAt: newUser?.createdAt,
    };
  }
  async processNewToken(refreshToken: string, response: Response) {
    try {
      //check refresh token hop le k neu k chuyen qua catch
      this.jwtService.verify(refreshToken, {
        secret: this.configserver.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      let user = await this.usersService.findUserRft(refreshToken);
      if (user) {
        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        //create refresh token
        const refreshToken = await this.createRefreshToken(payload);
        //update refresh token in db

        response.clearCookie('refreshtoken');
        await this.usersService.updateUserToken(
          user._id.toString(),
          refreshToken,
        );
        response.cookie('refreshtoken', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configserver.get<string>('JWT_REFRESH_EXPIRE')),
          secure: true, // set to true if your using HTTPS
        });
        return {
          access_token: this.jwtService.sign(payload),
          refreshToken: refreshToken,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      } else {
        throw new BadRequestException(
          `Refresh token Khong hop le . Vui long login`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `Refresh token Khong hop le . Vui long login`,
      );
    }
  }
  async logout(user: IUser, response: Response) {
    response.clearCookie('refreshtoken');
    await this.usersService.updateUserToken(user._id, '');
    return 'ok';
  }
}
