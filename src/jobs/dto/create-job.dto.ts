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
class CompanyDto {
  @IsMongoId({ message: '_id is mongoose ID' })
  @IsNotEmpty({ message: '_id company k duoc de trong' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: '_id company k duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'logo company k duoc de trong' })
  logo: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Name k duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Skills k duoc de trong' })
  @IsArray({ message: 'Skills co dinh dang la array' })
  @IsString({ each: true, message: 'Skill co dinh dang la string' })
  skills: string[];

  //validate object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @IsNotEmpty({ message: 'Location k duoc de trong' })
  location: string;

  @IsNotEmpty({ message: 'Salary k duoc de trong' })
  salary: number;

  @IsNotEmpty({ message: 'Quantity k duoc de trong' })
  quantity: number;

  @IsNotEmpty({ message: 'Lever k duoc de trong' })
  lever: string;

  @IsNotEmpty({ message: 'Description k duoc de trong' })
  description: string;

  @IsNotEmpty({ message: 'Startdate k duoc de trong' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Startdate  co kieu dang Date' })
  startDate: Date;

  @IsNotEmpty({ message: 'EndDate k duoc de trong' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'EndDate  co kieu dang Date' })
  endDate: Date;
}
