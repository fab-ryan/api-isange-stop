import { Injectable } from '@nestjs/common';
import { CreateAuthDto, ResetAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { ResponseService } from '@/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly responseService: ResponseService,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    try {
      const { email, password } = createAuthDto;
      const emailExists = await this.emailExists(email);
      if (!emailExists) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Email not found',
        });
      }
      const user = await this.userRepository.findOne({ where: { email } });
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Password is incorrect',
        });
      }
      const payload = { email: user.email, role: user.role };
      const token = await this.generateToken(payload);
      return this.responseService.response({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: token,
        key: 'access_token',
      });
    } catch (error) {
      const message = (error as Error).message;
      return this.responseService.response({
        success: false,
        statusCode: 400,
        message,
      });
    }
  }
  async emailExists(email: string): Promise<boolean> {
    const exists = await this.userRepository.exists({
      where: { email },
      withDeleted: true,
    });
    return exists;
  }

  private async generateToken(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  async resetPassword(params: ResetAuthDto) {
    try {
      const { email } = params;
      const emailExists = await this.emailExists(email);
      if (!emailExists) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Email not found',
        });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      const user = await this.userRepository.findOne({ where: { email } });
      const payload = { email: user.email, otp: otp };
      const token = await this.generateToken(payload);

      const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this.mailsService.sendResetPasswordMail(
        email,
        otp.toString(),
        link,
      );
      return this.responseService.response({
        success: true,
        statusCode: 200,
        message: 'Password reset successful',
        data: token,
      });
    } catch (error) {
      const message = (error as Error).message;
      return this.responseService.response({
        success: false,
        statusCode: 400,
        message,
      });
    }
  }
}
