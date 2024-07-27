import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  findAll() {
    return this.companyModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return await this.companyModel.findOne({ _id: id });
  }

  async GetPaginate(currentPage: number, limit: number, qs) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +limit ? +limit : 10;
    let offset = (+currentPage - 1) * +defaultLimit;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalpages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        currentPage,
        totalItems,
        totalpages,
        limit,
      },
      results: result,
    };
  }
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        Updateby: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return this.companyModel.deleteOne({
      _id: id,
    });
  }
}
