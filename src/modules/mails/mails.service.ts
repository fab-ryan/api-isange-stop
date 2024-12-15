import { Logger } from '@/utils';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordMail(email: string, otp: string, link: string) {
    Logger.logger.log(`Sending reset password mail to ${email}`);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: './reset-password',
      context: {
        otp,
        resetPasswordUrl: link,
      },
    });
  }
}
