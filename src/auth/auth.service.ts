import { IsEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@src/role/entites/role.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
        @InjectRepository(Role) private roleRepository:Repository<Role>,
        private jwtService:JwtService,
        private configService:ConfigService
    ){}

    async register(registerUserDto:RegisterUserDto):Promise<any>{
        let user = await this.userRepository.findOne({where: {email : registerUserDto.email}})
        if(!user){
            let role = await this.roleRepository.findOneBy({id: 1})
            const hassPassword = await this.hassPassword(registerUserDto.password);
            return await this.userRepository.save({...registerUserDto, password: hassPassword,role: role });
        }else {
            throw new HttpException("Email is already exist", HttpStatus.BAD_REQUEST);
        }
    } 

    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne({
            where : {email: loginUserDto.email},
            relations: {
                role:true
            },
            select: {
                role : {
                    id: true,
                    name: true
                }
            }
        })
        if(!user) {
            throw new HttpException("Email is not exist", HttpStatus.BAD_REQUEST);
        }
        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        if(!checkPass){
            throw new HttpException("Password is not correct", HttpStatus.BAD_REQUEST);
        }
        // genarate access token and refresh token
        const payload = {id: user.id, email: user.email, roles: user.role.name};
        console.log(payload)
        return this.generateToken(payload);

    }
    async refreshToken(refresh_token: string ): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token,{
                secret:this.configService.get<string>('JWT_SECRET')
            })
            const checkExitToken = await this.userRepository.findOneBy({email: verify.email, refresh_token})
            if(checkExitToken){
                return this.generateToken({id: verify.id, email: verify.email, roles: verify.roles})
            }else {
                throw new HttpException('Refresh token is not valid',HttpStatus.BAD_REQUEST)
            }

        } catch (error) {
            throw new HttpException('Refresh token is not valid123', HttpStatus.BAD_REQUEST)
        }
    }

    private async generateToken(payload: {id:number, email:string, roles:string}){
        const access_token = await this.jwtService.sign(payload);
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('EX_IN_REFRESH_TOKEN')
        })

        await this.userRepository.update(
            {email: payload.email},
            {refresh_token: refresh_token}
        
        )
        return {access_token : `Bearer ${access_token}`, refresh_token}
    }

    private async hassPassword(password:string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

  
   
}
