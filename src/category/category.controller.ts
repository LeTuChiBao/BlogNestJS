import { Controller, Get, UseGuards } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Public } from '@src/auth/decorator/public.decorator';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}

    @Get()
    @Public()
    findAll():Promise<Category[]> {
        return this.categoryService.findAll()
    }
}
