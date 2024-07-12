import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'email k dung dinh dang' })
  @IsNotEmpty({ message: 'email k duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'password k duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'name k duoc de trong' })
  @MinLength(3, { message: 'name phai nhieu hon 3 ki tu' })
  name: string;
  phone?: string;
  age?: number;
  address?: string;
}
