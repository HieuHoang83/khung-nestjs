import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
