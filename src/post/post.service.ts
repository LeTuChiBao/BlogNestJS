import { query } from 'express';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,

    ){}
    async create(userId: number, createPostDto:CreatePostDto):Promise<Post> {
        const user = await this.userRepository.findOneBy({id: userId})
        if(!user) throw new HttpException('Not found User id', HttpStatus.NOT_FOUND)
        
        try {
            const res = await this.postRepository.save({
                ...createPostDto,user
            })
            return await this.postRepository.findOneBy({id: res.id})
        } catch (error) {
            throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST)
        }
    }

    async findAll(query:FilterPostDto): Promise<any> {
        const limit = Number(query.limit) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const category = Number(query.category) || null;

        const skip = (page-1) * limit;
        const [res,total] = await this.postRepository.findAndCount({
            where: [
                {
                    title: Like ('%'+search+'%'),
                    category: {id:category}

                },
                {
                    description: Like ('%'+search+'%'),
                    category: {id:category}

                },
               
            ],
            order: {created_at:"DESC"},
            take:limit,
            skip:skip,
            relations: {
                user:true,
                category:true
            },
            select: {
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true
                },
                category: {
                    id: true,
                    name:true
                }
            }
        })

        const lastPage = Math.ceil(total/limit);
        const nextPage = page + 1 < lastPage ? page +1 : null;
        const prevPage = page - 1 >= 1 ? page -1 : null  

        return {
            data: res,
            total,
            currentPage : page,
            nextPage,
            prevPage,
            lastPage
        }

    }

    async findOne(id:number):Promise<Post> {
        const user =  await this.postRepository.findOne({
            where: {id},
            relations: {user:true, category:true},
            select: {
                user : {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true  
                },
                category: {
                    id: true,
                    name:true
                }
            }
        })
        if(!user) throw new HttpException('Not Found Post by Post Id', HttpStatus.NOT_FOUND)
        return user

    }

    async update(id:number, updatePostDto: UpdatePostDto):Promise<any>{
        const checkPost = await this.postRepository.findOneBy({id})
        if(!checkPost) throw new BadRequestException('Post Id Not Found')

        Object.assign(checkPost, updatePostDto)
        console.log(checkPost)
        const update = await this.postRepository.update(id, checkPost)
        if(!update) throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            status: 'Success',
            affected: `${update.affected} post(s)`,
            data: checkPost

        };
    }

    async delete (id: number):Promise<any>{
        const checkPost = await this.postRepository.findOneBy({id})
        if(!checkPost) throw new BadRequestException('Post Id Not Found')
        const checkDelete = await this.postRepository.delete({id})
        if(!checkDelete) throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            status: 'Success',
            affected: `Deleted ${checkDelete.affected} post(s)`
        };
    }

}
