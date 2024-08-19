import { Controller, Get,Post, Body, Param, UseGuards, ValidationPipe,UsePipes, Put, Delete, Query, Req, UploadedFile, UseInterceptors, BadRequestException, ParseArrayPipe, SetMetadata } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags ,ApiResponse} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { Roles } from '@src/auth/decorator/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {

    constructor(
        private userService:UserService
    ){}

    

    @Get()
    // @SetMetadata('roles', ['Admin']) viet file decorator để ngắn hơn
    @Roles('Admin','Supper')
    @ApiQuery({name:'page'})
    @ApiQuery({name:'limit'})
    @ApiQuery({name:'search'})
    @ApiResponse({status: 200, description: 'Get User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        return this.userService.findAll(query)
    }

    @Get('profile')
    @Roles('Admin','User','Supper')
    profile(@Req() req:any):Promise<User>{
        return this.userService.findOne(Number(req.user_data.id))
    }


    @Get(':id')
    @Roles('Admin','Supper')
    @ApiResponse({status: 200, description: 'Get User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    @ApiResponse({status: 404, description: 'Not Found!'})
    findOne(@Param('id') id:string):Promise<User> {
        return this.userService.findOne(Number(id))
    }

    @Post()
    @Roles('Admin','Supper')
    @ApiResponse({status: 200, description: 'Created User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    @UsePipes(ValidationPipe)
    create(@Body() createUserDto:CreateUserDto): Promise<User>{
        return this.userService.create(createUserDto)
    }

    @Put(':id')
    @Roles('Admin','Supper')
    @ApiResponse({status: 200, description: 'Update User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    @ApiResponse({status: 404, description: 'Not Found User Id!'})
    update(@Param('id') id:string, @Body() updateUserDto : UpdateUserDto) {
        return this.userService.update(Number(id),updateUserDto)
    }

    @Delete('multiple')
    @Roles('Admin','Supper')
    @ApiResponse({status: 200, description: 'Delete User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    @ApiResponse({status: 404, description: 'Not Found User Id!'})
    // @UseGuards(AuthGuard)
    multipleDelete(@Query('ids',new ParseArrayPipe({items:String, separator: ','})) ids: string[]) {
        console.log("deletemultiple", ids)
        return this.userService.multipleDelete(ids)
    }

    @Delete(':id')
    @Roles('Admin','Supper')
    @ApiResponse({status: 200, description: 'Delete User sucessfully!'})
    @ApiResponse({status: 401, description: 'Missing Bearer token!'})
    @ApiResponse({status: 404, description: 'Not Found User Id!'})
    delete(@Param('id') id:string) {
        return this.userService.delete(Number(id))
    }


    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
        fileFilter: (req, file ,cb) => {
            const ext = extname(file.originalname);
            const allowedExt = ['.jpg', '.png', '.jpeg']
            if(!allowedExt.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExt.toString()} `
                cb(null,false)
            }else{
                const filesize = parseInt(req.headers['content-length']);
                if(filesize > 1024 * 1024 * 5){
                    req.fileValidationError =  `Your file size is too large ${filesize.toString()}. Accepted file size is less than 5MB`;
                    cb(null,false)
                }else{
                    cb(null,true)
                }

            }
        }

    }))
    uploadAvata(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        if(req.fileValidationError)  throw new BadRequestException(req.fileValidationError)
        if(!file) throw new BadRequestException('File is require')
        console.log(file)
        return this.userService.updataAvatar(req.user_data.id, file.fieldname+'/'+file.filename)
   
    }

}
