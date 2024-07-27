import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    let { name, description, isActive, permissions } = createRoleDto;
    let Role = await this.RoleModel.findOne({
      name: name,
    });
    if (Role) {
      throw new BadRequestException(`Role ${name} da ton tai tren he thong`);
    }
    return this.RoleModel.create({
      name,
      description,
      isActive,
      permissions,
      createBy: { _id: user._id, email: user.email },
    });
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return await this.RoleModel.findById(id).populate({
      //path => truong join vs bang khac
      path: 'permissions',
      //1 => hien tri col do
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }
  async findbyNameRole(name: string) {
    let role = await this.RoleModel.findOne({ name: name }).populate({
      //path => truong join vs bang khac
      path: 'permissions',
      //1 => hien tri col do
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
    if (!role) {
      throw new BadRequestException(`role Name khong ton tai tren he thong`);
    } else {
      return role;
    }
  }
  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    let { name, description, isActive, permissions } = updateRoleDto;
    let Role = await this.RoleModel.findOne({
      _id: id,
    });
    if (Role.name !== name) {
      let Roleprev = await this.RoleModel.findOne({
        name: name,
      });
      if (Roleprev) {
        throw new BadRequestException(`Role ${name}: da ton tai tren he thong`);
      }
    }
    return await this.RoleModel.updateOne(
      { _id: id },
      {
        name,
        description,
        isActive,
        permissions,
        Updateby: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return await this.RoleModel.deleteOne({
      _id: id,
    });
  }
}
