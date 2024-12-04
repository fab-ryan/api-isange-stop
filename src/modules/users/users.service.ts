import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseService } from '@/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from '@/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly responseService: ResponseService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, role } = createUserDto;
      const isEmailExists = await this.emailExists(email);

      if (isEmailExists) {
        return this.responseService.response({
          data: null,
          message: 'Email already exists',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: role as Roles,
      });
      await this.userRepository.save(user);
      return this.responseService.response({
        data: user,
        message: 'User created successfully',
        statusCode: 201,
        success: true,
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
}
