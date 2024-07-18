import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Permission,
  Permissionschema,
} from 'src/permissions/schemas/permission.schema';
import { Company, Companyschema } from 'src/companies/schemas/company.schema';
import { Job, Jobschema } from 'src/jobs/schemas/job.schema';
import { Resume, Resumeschema } from 'src/resumes/schemas/resume.schema';
import { Role, Roleschema } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: Permissionschema },
      { name: Role.name, schema: Roleschema },

      //{ name: Company.name, schema: Companyschema },
      //{ name: Job.name, schema: Jobschema },
      // { name: Resume.name, schema: Resumeschema },
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService, RolesService, UsersService, PermissionsService],
})
export class DatabaseModule {}
