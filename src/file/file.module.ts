import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  imports: [
    //khong the sd cho pham vi global
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
