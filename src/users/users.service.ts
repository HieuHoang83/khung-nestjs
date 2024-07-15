import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashpassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createuserdto: CreateUserDto, user: IUser) {
    let isExist = await this.findOneByemail(createuserdto.email);

    if (isExist) {
      throw new BadRequestException(
        `email ${createuserdto.email}: da ton tai tren he thong`,
      );
    }

    createuserdto.password = this.hashpassword(createuserdto.password);

    let newuser = await this.userModel.create({
      ...createuserdto,
      role: 'User',
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newuser;
  }
  async register(registerUserdto: RegisterUserDto) {
    let isExist = await this.findOneByemail(registerUserdto.email);

    if (isExist) {
      throw new BadRequestException(
        `email ${registerUserdto.email}: da ton tai tren he thong`,
      );
    }

    registerUserdto.password = this.hashpassword(registerUserdto.password);

    let user = await this.userModel.create({
      ...registerUserdto,
      role: 'User',
    });
    return user;
  }
  async GetPaginate(currentPage: number, limit: number, qs) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +limit ? +limit : 10;
    let offset = (+currentPage - 1) * +defaultLimit;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalpages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
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
      throw new BadRequestException(`id khong ton tai tren he thong`);
    }
    return await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password');
  }
  async findOneByemail(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }
  findUserRft = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken: refreshToken })
      .select('-password');
  };
  CheckUserpassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      throw new BadRequestException(`id khong ton tai tren he thong`);
    }
    if (
      await this.userModel.findOne({
        email: updateUserDto.email,
      })
    ) {
      throw new BadRequestException(
        `email ${updateUserDto.email}: da ton tai tren he thong`,
      );
    }
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        Updateby: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  updateUserToken = async (_id: string, refreshToken: string) => {
    return await this.userModel.updateOne(
      { _id: _id },
      {
        refreshToken: refreshToken,
      },
    );
  };
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found';
    }
    return await this.userModel.deleteOne({
      _id: id,
    });
  }
}
