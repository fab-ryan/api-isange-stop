import { Match } from '@/decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the user',
  })
  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    },
    {
      message: 'Email must be a valid email address',
    },
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @ApiProperty({
    example: '08012345678',
    description: 'The phone number of the user',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  @Matches(/\(?([78|79|72|73]{2})\)?([0-9]{7})$/, {
    message:
      'Phone number must contain only numbers and must start with 78, 79, 72, or 73',
  })
  phone: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
  })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The password ',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Password must contain only letters and numbers',
  })
  password: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'confirm password',
  })
  @IsString()
  @IsNotEmpty({
    message: 'confirm password is required',
  })
  @MinLength(6, {
    message: 'confirm password must be at least 6 characters',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'confirm password must contain only letters and numbers',
  })
  @Match('password', {
    message: 'password and confirm password do not match',
  })
  confirm_password: string;
}
