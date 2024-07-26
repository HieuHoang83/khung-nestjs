import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}
  @Get()
  @Public()
  @ResponseMessage('test email')
  async handleMail() {
    await this.mailerService.sendMail({
      to: 'hieu.hoangminh832004@hcmut.edu.vn',
      from: '"Support Team" <hoangminhhieu2712192@gmail.com>',
      subject: 'Test Email',
      template: 'test',
    });
  }
}
