import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashpassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createuserdto: CreateUserDto) {
    let isExist = await this.findOneByemail(createuserdto.email);

    if (isExist) {
      return 'tai khoan da ton tai';
    }
    if (createuserdto.password.trim().length < 5) {
      return 'mat khau ';
    }
    createuserdto.password = this.hashpassword(createuserdto.password.trim());

    let user = await this.userModel.create(createuserdto);
    return user;
  }

  findAll() {
    //return this.userModel.findAll({_id});
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found';
    }
    return await this.userModel.findOne({
      _id: id,
    });
  }
  findOneByemail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }
  CheckUserpassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      return 'not found';
    }
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      updateUserDto,
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found';
    }
    return this.userModel.deleteOne({
      _id: id,
    });
  }
}
