import { AuthService } from './auth.service';
import { Controller, Post, Body, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('register')
    // @SetMetadata('isPublic', true)
    @Public()
    @ApiResponse({status: 201, description: 'Register sucessfully!'})
    @ApiResponse({status: 400, description: 'Bad Request!'})
    @UsePipes(ValidationPipe)
    register(@Body() registerUserDto:RegisterUserDto):Promise<User> {
        return this.authService.register(registerUserDto)
    }

    @Post('login')
    @Public()
    @ApiResponse({status: 201, description: 'Login sucessfully!'})
    @ApiResponse({status: 400, description: 'Bad Request!'})
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto:LoginUserDto): Promise<any> {
        return this.authService.login(loginUserDto)
    }

    @Post('refresh-token')
    @Public()
    @ApiResponse({status: 201, description: 'Refresh token sucessfully!'})
    @ApiResponse({status: 400, description: 'Bad Request'})
    refreshToken(@Body() {refresh_token}):Promise<any> {
        return this.authService.refreshToken(refresh_token)
    }

}
