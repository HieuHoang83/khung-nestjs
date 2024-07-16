import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  GetRootPath = () => {
    return process.cwd();
  };
  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (err) => {
      if (!err) {
        return;
      }
      switch (err.code) {
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          console.error(err);
          break;
      }
    });
  }
  //cau hinh noi luu tru file upload
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'FileUpload';
          this.ensureExists(`public/images/${folder}`);
          cb(null, join(this.GetRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, callback) => {
          //get img extension
          let extName = path.extname(file.originalname);

          //get img name
          let baseName = path.basename(file.originalname, extName);

          let finalName = `${baseName}-${Date.now()}${extName}`;
          callback(null, finalName);
        },
      }),
    };
  }
}
