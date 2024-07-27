import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { Job } from './schemas/job.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}
  create(createJobDto: CreateJobDto, user: IUser) {
    let { startDate, endDate } = createJobDto;
    if (startDate >= endDate) {
      throw new BadRequestException('startDate vs endDate k hợp lệ ');
    }
    return this.jobModel.create({
      ...createJobDto,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async GetPaginate(currentPage: number, limit: number, qs) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +limit ? +limit : 10;
    let offset = (+currentPage - 1) * +defaultLimit;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalpages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    let user = await this.jobModel.findOne({ _id: id });
    return { user: user };
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return await this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
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
    return this.jobModel.deleteOne({
      _id: id,
    });
  }
}
