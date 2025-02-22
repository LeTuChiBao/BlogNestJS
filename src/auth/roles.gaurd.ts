import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector : Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const requireRoles = this.reflector.getAllAndOverride<string[]>('roles',[
            context.getHandler(),
            context.getClass()
        ])
        if(!requireRoles) return true
        const {user_data} = context.switchToHttp().getRequest()

        return requireRoles.some(role=> user_data.roles.split(',').includes(role))
    }

}