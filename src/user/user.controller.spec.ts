import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { FilterUserDto } from './dto/filter-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userRepository : Repository<User>

  const USER_REPOSITORY = getRepositoryToken(User)

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      currentPage: 1,
      nextPage: null,
      prevPage: null,
      lastPage: 1
    }),
    findOne: jest.fn().mockResolvedValue(new User()),
    create: jest.fn().mockResolvedValue(new User()),
    update: jest.fn().mockResolvedValue(new User()),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY);
  });

  describe('findAll', () => {
    it('Sound be defind',  () => {
      expect(service).toBeDefined();
    });
    // it('should return a paginated list of users', async () => {
    //   const result = await controller.findAll({} as FilterUserDto);
    //   expect(result).toEqual({
    //     data: [],
    //     total: 0,
    //     currentPage: 1,
    //     nextPage: null,
    //     prevPage: null,
    //     lastPage: 1
    //   });
    //   expect(service.findAll).toHaveBeenCalledWith({});
    // });
  });

});
