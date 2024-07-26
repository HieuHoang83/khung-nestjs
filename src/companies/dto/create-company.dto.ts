import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'name k duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'address k duoc de trong' })
  address: string;

  @IsNotEmpty({ message: 'description k duoc de trong' })
  description: string;

  logo: string;
}
