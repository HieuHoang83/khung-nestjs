import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
export class CreateRoleDto {
  @IsNotEmpty({ message: 'name k duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Description k duoc de trong' })
  description: string;

  @IsNotEmpty({ message: 'Method k duoc de trong' })
  isActive: string;

  @IsNotEmpty({ message: 'Module k duoc de trong' })
  module: string;

  @IsNotEmpty({ message: 'Permissions k duoc de trong' })
  @IsMongoId({ message: 'permissions is mongoose id' })
  @IsArray({ message: 'permissions co dinh dang la array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
