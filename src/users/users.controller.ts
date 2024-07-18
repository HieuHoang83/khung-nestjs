import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from './user.guard';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('create new user')
  async create(@Body() createuserdto: CreateUserDto, @User() user: IUser) {
    let newUser: any = await this.usersService.create(createuserdto, user);
    return {
      _id: newUser?._id,
      createAt: newUser?.createdAt,
    };
  }

  @Public()
  @ResponseMessage('get paginate user')
  @Get('')
  GetPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() qs: string,
  ) {
    return this.usersService.GetPaginate(currentPage, limit, qs);
  }

  @ResponseMessage('get by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('update user')
  @Patch('')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updateUser: any = await this.usersService.update(updateUserDto, user);
    return updateUser;
  }

  @ResponseMessage('delete user')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let deleteuser: any = await this.usersService.remove(id);
    return deleteuser;
  }
}
