import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateAuthDto,
  ResetAuthDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
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
          statusCode: 401,
          message: 'Incorrect Username or Password',
        });
      }
      const payload = { email: user.email, role: user.role, id: user.id };
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
      return this.responseService.errorResponse({
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

  async forgotPassword(params: ResetAuthDto) {
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

  async changePassword(payload: ChangePasswordDto, user: any) {
    try {
      const userExists = await this.emailExists(user.email);
      if (!userExists) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Email not found',
        });
      }
      const { password, newpassword } = payload;
      const userPassword = await this.userRepository.findOne({
        where: { email: user.email },
      });
      const isPasswordMatch = await bcrypt.compare(
        password,
        userPassword.password,
      );
      if (!isPasswordMatch) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Incorrect Password',
        });
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      await this.userRepository.update(
        { email: user.email },
        { password: hashedPassword },
      );
      return this.responseService.response({
        success: true,
        statusCode: 200,
        message: 'Password changed successfully',
      });
    } catch (error) {
      const message = (error as Error).message;
      return this.responseService.errorResponse({
        success: false,
        statusCode: 400,
        message,
      });
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    try {
      const { token, password } = payload;
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const emailExists = await this.emailExists(user.email);
      if (!emailExists) {
        return this.responseService.response({
          success: false,
          statusCode: 400,
          message: 'Email not found',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.update(
        { email: user.email },
        { password: hashedPassword },
      );
      return this.responseService.response({
        success: true,
        statusCode: 200,
        message: 'Password reset successful',
      });
    } catch (error) {
      const message = (error as Error).message;
      return this.responseService.errorResponse({
        success: false,
        statusCode: 400,
        message,
      });
    }
  }
}
