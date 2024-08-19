import { dataSourceOptions } from '../db/data-source';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.gaurd';
import { AuthGuard } from './auth/auth.guard';
import { User } from './user/entities/user.entity';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions ),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    PostModule,
    CategoryModule,
    TypeOrmModule.forFeature([User]),
    RoleModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
