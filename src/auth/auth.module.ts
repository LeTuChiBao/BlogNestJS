import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@src/role/entites/role.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User,Role]),
  JwtModule.registerAsync({
    imports: [ConfigModule], 
    inject: [ConfigService], 
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'), 
      signOptions: { expiresIn: '1d' }, 
    }),
  }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
