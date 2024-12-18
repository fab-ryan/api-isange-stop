import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ChangePasswordDto,
  ResetAuthDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@/guards';
import { Roles, User } from '@/decorators';
import { Roles as RolesEnum } from '@/enums';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login', description: 'Login user' })
  @Post()
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 401, description: 'Incorrect Username or Password' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @ApiOperation({ summary: 'Forgot password', description: 'Forgot password' })
  @Post('forgot-password')
  @ApiResponse({ status: 200, description: 'Password reset link sent' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  forgotPassword(@Body() resetAuthDto: ResetAuthDto) {
    return this.authService.forgotPassword(resetAuthDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RolesEnum.ALL)
  @ApiOperation({ summary: 'Change password', description: 'Change password' })
  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 401, description: 'Incorrect Username or Password' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() req) {
    return this.authService.changePassword(changePasswordDto, req);
  }

  @ApiOperation({ summary: 'Reset password', description: 'Reset password' })
  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 401, description: 'Incorrect Username or Password' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
