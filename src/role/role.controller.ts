import { Controller, Get } from '@nestjs/common';
import { Role } from './entites/role.entity';
import { RoleService } from './role.service';
import { Public } from '@src/auth/decorator/public.decorator';

@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService){}

    @Get()
    @Public()
    findAll():Promise<Role[]> {
        return this.roleService.findAll()
    }
}
