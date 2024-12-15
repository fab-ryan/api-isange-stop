import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateAuthDto {
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
    example: 'password',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters',
  })
  password: string;
}

export class ResetAuthDto {
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
}
