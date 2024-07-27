import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './schemas/resume.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}
  create(createResumeDto: CreateResumeDto, user: IUser) {
    return this.resumeModel.create({
      email: user.email,
      userId: user._id,
      ...createResumeDto,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updateAt: new Date(),
          updateBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
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

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalpages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
    let user = await this.resumeModel.findOne({ _id: id });
    return { user: user };
  }

  GetResume(user: IUser) {
    return this.resumeModel
      .find({ userId: user._id })
      .sort('-createAt')
      .populate([
        {
          path: 'companyId',
          select: {
            name: 1,
          },
        },
        {
          path: 'jobId',
          select: {
            name: 1,
          },
        },
      ]);
  }
  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }

    return await this.resumeModel.updateOne(
      { _id: id },
      {
        status: updateResumeDto.status,
        $push: {
          history: {
            status: updateResumeDto.status,
            updateAt: new Date(),
            updateBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },

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
    return this.resumeModel.deleteOne({
      _id: id,
    });
  }
}
