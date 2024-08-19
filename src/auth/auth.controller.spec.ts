import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockAuthService = {
  register: jest.fn().mockResolvedValue({} as User),
  login: jest.fn().mockResolvedValue({}),
  refreshToken: jest.fn().mockResolvedValue({}),
};

const mockJwtService = {};
const mockConfigService = { get: jest.fn().mockReturnValue('mockSecret') };
const mockUserRepository = {};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
          AuthService
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Các test case khác cho controller
});
