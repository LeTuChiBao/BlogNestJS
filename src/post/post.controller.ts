import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { Public } from '@src/auth/decorator/public.decorator';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {

    constructor(private postService : PostService){}

    @Post()
    @Roles('User','Admin','Supper')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('thumbnail',{ storage:storageConfig('thumbnail'),
        fileFilter: (req, file ,cb) => {
            const ext = extname(file.originalname);
            const allowedExt = ['.jpg', '.png', '.jpeg']
            if(!allowedExt.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExt.toString()} `
                cb(null,false)
            }else{
                const filesize = parseInt(req.headers['content-length']);
                if(filesize > 1024 *1024 *5 ){
                    req.fileValidationError =  `Your file size is too large ${filesize.toString()}. Accepted file size is less than 5MB`;
                    cb(null,false)
                }else{
                    cb(null,true)
                }

            }
        }
    }))
    create(@Req() req:any, @Body() createPostDto:CreatePostDto , @UploadedFile() file:Express.Multer.File ){
        if(req.fileValidationError)  throw new BadRequestException(req.fileValidationError)
        return this.postService.create(req['user_data'].id, {...createPostDto,thumbnail: file.fieldname+'/'+file.filename })

    }

    @Get()
    @Roles('Admin','Supper')
    findAll(@Query() query: FilterPostDto): Promise<any>{
        return this.postService.findAll(query)
    }

    @Get(':id')
    @Roles('User','Admin','Supper')
    findOne(@Param('id') id: string): Promise<PostEntity>{
        return this.postService.findOne(Number(id))
    }

    @Put(':id')
    @Roles('User','Admin','Supper')
    @UseInterceptors(FileInterceptor('thumbnail',{ storage:storageConfig('thumbnail'),
        fileFilter: (req, file ,cb) => {
            const ext = extname(file.originalname);
            const allowedExt = ['.jpg', '.png', '.jpeg']
            if(!allowedExt.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExt.toString()} `
                cb(null,false)
            }else{
                const filesize = parseInt(req.headers['content-length']);
                if(filesize > 1024 *1024 *5 ){
                    req.fileValidationError =  `Your file size is too large ${filesize.toString()}. Accepted file size is less than 5MB`;
                    cb(null,false)
                }else{
                    cb(null,true)
                }

            }
        }
    }))
    update(@Param('id') id:string , @Req() req:any , @Body() updatePostDto:UpdatePostDto , @UploadedFile() file: Express.Multer.File){
        console.log('Đã vào update',req.fileValidationError)
        if(req.fileValidationError) throw new BadRequestException(req.fileValidationError)
        if(file){
            updatePostDto.thumbnail = file.fieldname+ '/' + file.filename
        }
        return this.postService.update(Number(id), updatePostDto)  
    }

    @Delete(':id')
    @Roles('User','Admin','Supper')
    delete(@Param('id') id:string){
        return this.postService.delete(Number(id))
    }

    @Post('cke-upload')
    @Roles('User','Admin','Supper')
    @UseInterceptors(FileInterceptor('upload',{ storage:storageConfig('ckeditor'),
        fileFilter: (req, file ,cb) => {
            const ext = extname(file.originalname);
            const allowedExt = ['.jpg', '.png', '.jpeg']
            if(!allowedExt.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExt.toString()} `
                cb(null,false)
            }else{
                const filesize = parseInt(req.headers['content-length']);
                if(filesize > 1024 *1024 *5 ){
                    req.fileValidationError =  `Your file size is too large ${filesize.toString()}. Accepted file size is less than 5MB`;
                    cb(null,false)
                }else{
                    cb(null,true)
                }

            }
        }
    }))
    ckeUpload( @Body() data:any , @UploadedFile() file:Express.Multer.File ){
        console.log("data =>",data)
        return{
            'url': `ckeditor/${file.filename}`
        }
    }

}
