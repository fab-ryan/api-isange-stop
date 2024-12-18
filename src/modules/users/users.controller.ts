import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseService } from '@/utils';
import { Roles } from '@/decorators';
import { Roles as RolesEnum } from '@/enums';
import { AuthGuard } from '@/guards';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CreateUserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  findAll() {
    return this.usersService.findAllUsers();
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by id', description: 'Get user by id' })
  @Get('getUserById')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneUser(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
