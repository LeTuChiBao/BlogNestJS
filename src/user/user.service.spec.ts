import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '..//post/entities/post.entity';

const mockUserRepository = {
  findAll: jest.fn().mockResolvedValue([[
    {
     id : 8,
     firstName : "le",
     lastName : "son",
     email : "use3r@discoveryloft.com",
     status : 1,
     create_at : "2024-08-14T07:29:58.458Z",
     update_at : "2024-08-14T07:43:29.000Z"
    },
    {
     id : 7,
     firstName : "phuong",
     lastName : "linh",
     email : "user2@discoveryloft.com",
     status : 1,
     create_at : "2024-08-14T07:29:07.227Z",
     update_at : "2024-08-14T07:29:07.227Z"
    }
]]),
  findOne: jest.fn().mockResolvedValue({
    id: 8,
    firstName: "le",
    lastName : "son",
    email : "use3r@discoveryloft.com",
    status : 1,
    create_at : "2024-08-14T07:29:58.458Z",
    update_at : "2024-08-14T07:43:29.000Z"
}),
};
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, 
        {
        provide: getRepositoryToken(User),
        useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(Post),
          useValue: mockUserRepository
        },
    ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
