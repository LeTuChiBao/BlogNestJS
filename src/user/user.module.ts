import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Role } from '@src/role/entites/role.entity';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    TypeOrmModule.forFeature([User,Role])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
