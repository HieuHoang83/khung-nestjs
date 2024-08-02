import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
class CompanyDto {
  @IsMongoId({ message: '_id is mongoose ID' })
  @IsNotEmpty({ message: '_id company k duoc de trong' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: '_id company k duoc de trong' })
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name k duoc de trong' })
  @MinLength(3, { message: 'Name phai nhieu hon 3 ki tu' })
  name: string;

  @IsEmail({}, { message: 'Email k dung dinh dang' })
  @IsNotEmpty({ message: 'Email k duoc de trong' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty({ message: 'type nguoi dung k duoc de trong' })
  type: string;

  @IsNotEmpty({ message: 'Age k duoc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Gender k duoc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Address k duoc de trong' })
  address: string;

  @IsNotEmpty({ message: 'Role k duoc de trong' })
  @IsMongoId({ message: 'role dang mongoose Id' })
  role: string;
  //validate object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
export class RegisterUserSystemDto {
  @IsEmail({}, { message: 'Email k dung dinh dang' })
  @IsNotEmpty({ message: 'Email k duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Password k duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'Name k duoc de trong' })
  @MinLength(3, { message: 'Name phai nhieu hon 3 ki tu' })
  name: string;

  @IsNotEmpty({ message: 'Age k duoc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Gender k duoc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Address k duoc de trong' })
  address: string;
}
export class RegisterUserSocialDto {
  @IsEmail({}, { message: 'Email k dung dinh dang' })
  @IsNotEmpty({ message: 'Email k duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Name k duoc de trong' })
  @MinLength(3, { message: 'Name phai nhieu hon 3 ki tu' })
  name: string;

  @IsNotEmpty({ message: 'type k duoc de trong' })
  type: string;
}
export class LOGINDTO {
  @IsEmail({}, { message: 'Email k dung dinh dang' })
  @IsNotEmpty({ message: 'Email k duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Name k duoc de trong' })
  @MinLength(3, { message: 'Name phai nhieu hon 3 ki tu' })
  name: string;

  @IsNotEmpty({ message: 'type k duoc de trong' })
  type: string;
}
export class RefreshTokenDTO {
  @IsNotEmpty({ message: 'refreshToken k duoc de trong' })
  refreshToken: string;
  @IsNotEmpty({ message: 'accessToken k duoc de trong' })
  accessToken: string;
}
