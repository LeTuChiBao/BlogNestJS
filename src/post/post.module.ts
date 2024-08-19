import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [JwtModule, ConfigModule,
    TypeOrmModule.forFeature([Post, User])
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
