import { Module } from '@nestjs/common';
import { DBModule } from '@/extra';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailsModule } from './modules/mails/mails.module';

@Module({
  imports: [UsersModule, DBModule, AuthModule, MailsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
