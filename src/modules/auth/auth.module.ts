import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config';
import { ResponseService } from '@/utils';
import { JwtStrategy } from '@/strategy';
import { MailsModule } from '../mails/mails.module';

@Module({
  imports: [
    JwtModule.register({
      secret: config().secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
    MailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
