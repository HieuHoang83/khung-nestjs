import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private PermissionModel: Model<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    let { name, apiPath, method, module } = createPermissionDto;
    let permission = await this.PermissionModel.findOne({
      apiPath: apiPath,
      method: method,
    });
    if (permission) {
      throw new BadRequestException(`permission da ton tai tren he thong`);
    }
    return this.PermissionModel.create({
      name: name,
      apiPath: apiPath,
      method: method,
      module: module,
      createBy: { _id: user._id, email: user.email },
    });
  }

  async GetPaginate(currentPage: number, limit: number, qs) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +limit ? +limit : 10;
    let offset = (+currentPage - 1) * +defaultLimit;

    const totalItems = (await this.PermissionModel.find(filter)).length;
    const totalpages = Math.ceil(totalItems / defaultLimit);

    const result = await this.PermissionModel.find(filter)
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

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    return this.PermissionModel.findOne({
      _id: id,
    });
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`id is not Exist`);
    }
    let { name, apiPath, method, module } = updatePermissionDto;
    let permission = await this.PermissionModel.findOne({
      _id: id,
    });
    if (permission.apiPath !== apiPath || permission.method !== method) {
      let permissionprev = await this.PermissionModel.findOne({
        apiPath: apiPath,
        method: method,
      });
      if (permissionprev) {
        throw new BadRequestException(
          `apiPath method da ton tai tren he thong`,
        );
      }
    }
    return await this.PermissionModel.updateOne(
      { _id: id },
      {
        name,
        apiPath,
        method,
        module,
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
    return await this.PermissionModel.deleteOne({
      _id: id,
    });
  }
}
