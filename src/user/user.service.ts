import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Role } from '@src/role/entites/role.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
        @InjectRepository(Role) private roleRepository:Repository<Role>,
    ){}

    async findAll(query: FilterUserDto):Promise<any> {
        const limit = Number(query.limit) || 10 ;
        const page = Number(query.page) || 1;
        const skip = (page -1)* limit
        const keyword = query.search || ''
        const [res,total] =  await this.userRepository.findAndCount({
            where: [
                {firstName: Like('%'+ keyword+'%')},
                {lastName: Like('%'+ keyword+ '%')},
                {email: Like('%'+ keyword+ '%')},
            ],
            relations: {
                role:true
            },
            order: {created_at: "DESC"},
            take : limit,
            skip : skip,
            select: ['id', 'firstName', 'lastName','email','status','created_at','updated_at']
        })

        const lastPage = Math.ceil(total/limit);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page -1;

        return {
            data : res,
            total : total,
            currentPage : page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async findOne(id:number):Promise<User> {
         let user = await this.userRepository.findOne({
            where: {id},
            relations: {role: true},
            select: ['id', 'firstName', 'lastName','email','status','created_at','updated_at']
         });
         if(!user) throw new HttpException('Not Found',HttpStatus.NOT_FOUND)
         return user;
    }

    async create(createUserDto:CreateUserDto):Promise<User> {
        const emailCheck = await this.userRepository.findOneBy({email: createUserDto?.email})
        if(emailCheck) throw new HttpException('Email is Exist',HttpStatus.BAD_REQUEST)
        const hassPassword = await this.hassPassword(createUserDto.password)
        console.log(createUserDto)
        return await this.userRepository.save({...createUserDto,password: hassPassword});
    }

    async update(id:number ,updateUserDto:UpdateUserDto):Promise<any> {
        let user = await this.userRepository.findOneBy({id});
        if(!user) throw new HttpException('Not Found',HttpStatus.NOT_FOUND)

        
        let checkupdate =  await this.userRepository.update(id,updateUserDto);
        if (checkupdate.affected === 0) {
            throw new HttpException('DB Cannot Update', HttpStatus.NOT_IMPLEMENTED);
        }
        const updatedUser = await this.userRepository.findOne({where : {id},relations: {role:true} });
        return { status: 'Success', action: 'Update User', user: updatedUser };
    }

    async delete(id:number):Promise<any> {
        let user = await this.userRepository.findOneBy({id});
        if(!user) throw new HttpException('Not Found',HttpStatus.NOT_FOUND)
        let checkDelete =  await this.userRepository.delete(id);
        if (checkDelete.affected === 0) {
            throw new HttpException('DB Cannot Delete', HttpStatus.NOT_IMPLEMENTED);
        }
        return { status: 'Success',action: 'Delete User', user: user };
    }

    async updataAvatar(id: number , avatar:string):Promise<UpdateResult>{
        let user = await this.userRepository.findOneBy({id});
        if(!user) throw new HttpException('Not Found',HttpStatus.NOT_FOUND)
        return await this.userRepository.update(id, {avatar});
    }

    private async hassPassword(password:string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    async multipleDelete(ids: string[]):Promise<DeleteResult>{
        return await this.userRepository.delete({id: In(ids)})
    }

}
