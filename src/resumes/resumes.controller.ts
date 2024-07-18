import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('create resume ')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Post(':id')
  @ResponseMessage('get cv by user jwt ')
  GetResume(@User() user: IUser) {
    return this.resumesService.GetResume(user);
  }

  @Get()
  //truyen param populate=companyId,jobId de lay full database company,job by id cua resume
  //truyen param fields =companyid.id,jobId.id  de gioi han key lay ve tu database
  @ResponseMessage('Get Paginate resume ')
  GetPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() qs: string,
  ) {
    return this.resumesService.GetPaginate(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get resume by id ')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('update resume by id ')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('delete resume by id ')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(id);
  }
}
