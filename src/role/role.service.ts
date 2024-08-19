import { Injectable } from '@nestjs/common';
import { Role } from './entites/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role> ){}

    async findAll():Promise<Role[]>{
        return await this.roleRepository.find();
    }
}
