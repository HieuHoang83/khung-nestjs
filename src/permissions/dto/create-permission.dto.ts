import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name k duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'ApiPath k duoc de trong' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method k duoc de trong' })
  method: string;

  @IsNotEmpty({ message: 'Module k duoc de trong' })
  module: string;
}
