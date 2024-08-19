import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsOptional } from "class-validator";
import { Category } from "src/category/entities/category.entity";
import { User } from "src/user/entities/user.entity";

export class CreatePostDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    summary: string;

    @ApiProperty()
    @IsOptional()
    thumbnail: string;

    @ApiProperty()
    @IsOptional()
    status: number;
    
    @ApiProperty()
    @IsNotEmpty()
    category: Category

}