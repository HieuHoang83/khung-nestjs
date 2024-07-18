import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
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
export class CreateResumeDto {
  @IsNotEmpty({ message: ' Url k duoc de trong' })
  url: string;
  @IsMongoId({ message: 'companyId is mongoose ID' })
  @IsNotEmpty({ message: 'CompanyId company k duoc de trong' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'jobId is mongoose ID' })
  @IsNotEmpty({ message: 'JobId company k duoc de trong' })
  jobId: mongoose.Schema.Types.ObjectId;
}
