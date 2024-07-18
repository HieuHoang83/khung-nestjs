import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Version,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import ms from 'ms';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Post()
  @ResponseMessage('create Company')
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get Paginate')
  GetPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() qs: string,
  ) {
    return this.companiesService.GetPaginate(currentPage, limit, qs);
  }

  @Public()
  @Version('1')
  @ResponseMessage('Get company by id')
  @Get(':id')
  findOne1(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('update company by id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ResponseMessage('delete company by id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
