import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ResponseService } from '@/utils';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn((userDto) => {
      if (userDto.email === 'test@gmail.com') {
        return {
          success: false,
          statusCode: 400,
          message: 'Email already exists',
        };
      }
      return {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        ResponseService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });
  const user = {
    email: 'test@gmail.com',
    password: 'password',
    role: 'admin',
    name: 'test',
    phone: '7947474747',
    confirm_password: 'password',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await controller.create({
      ...user,
      email: 'newuser@example.com',
    });
    expect(result).toEqual({
      success: true,
      statusCode: 201,
      message: 'User created successfully',
    });
    expect(controller.create(user)).toEqual({
      success: true,
      statusCode: 201,
      message: 'User created successfully',
    });

    expect(service.create).toHaveBeenCalledWith({
      ...user,
      email: 'newuser@example.com',
    });
  });
  it("should return 'Email already exists' message", () => {
    expect(controller.create(user)).toEqual({
      success: false,
      statusCode: 400,
      message: 'Email already exists',
    });
  });
});
