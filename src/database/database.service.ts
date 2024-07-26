import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/schemas/role.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_Role, INIT_PERMISSIONS, USER_Role } from './sample';
import { Logger } from '@nestjs/common';
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    private usersService: UsersService,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private configServer: ConfigService,
  ) {}
  async onModuleInit() {
    const isInit = this.configServer.get<string>('SHOULD_init');
    if (Boolean(isInit)) {
      const permissonCounter = await this.permissionModel.countDocuments({});
      const roleCounter = await this.roleModel.countDocuments({});
      const userCounter = await this.userModel.countDocuments({});
      if (permissonCounter == 0) {
        console.log('khoi tao permisson');
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }
      if (roleCounter == 0) {
        console.log('khoi tao roles');
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_Role,
            description: 'Quan tri vien',
            isActive: true,
            permissions,
          },
          {
            name: USER_Role,
            description: 'Nguoi dung /Ung vien su dung ung dung',
            isActive: true,
            permissions: [],
          },
        ]);
      }
      if (userCounter == 0) {
        console.log('khoi tao user');
        const adminRole = await this.roleModel.findOne({ name: ADMIN_Role });
        const userRole = await this.roleModel.findOne({ name: USER_Role });
        await this.userModel.insertMany([
          {
            name: 'I am admin',
            email: 'Admin@gmail.com',
            password:
              '$2a$10$Nj7K3duP944nzoBwg4iq2e4mfCw6AAcSikqOBEUybPHKtPCHxWv8a',
            age: 20,
            gender: 'Nam',
            address: 'Viet Nam',
            role: adminRole?._id,
            type: 'SYSTEM',
          },
          {
            name: 'I am Hoang Hieu',
            email: 'HieuHoang@gmail.com',
            password:
              '$2a$10$Nj7K3duP944nzoBwg4iq2e4mfCw6AAcSikqOBEUybPHKtPCHxWv8a',
            age: 30,
            gender: 'Nam',
            address: 'HCM',
            role: userRole?._id,
            type: 'SYSTEM',
          },
          {
            name: 'I am user',
            email: 'User@gmail.com',
            password:
              '$2a$10$Nj7K3duP944nzoBwg4iq2e4mfCw6AAcSikqOBEUybPHKtPCHxWv8a',
            age: 30,
            gender: 'Nam',
            address: 'Ha noi',
            role: userRole?._id,
            type: 'SYSTEM',
          },
        ]);
      }
      if (userCounter > 0 && roleCounter > 0 && permissonCounter) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
      }
    }
  }
}
