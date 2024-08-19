import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@src/category/entities/category.entity";
import { IsAlphanumeric, IsNotEmpty, IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class UpdatePostDto {
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty()
    @IsNotEmpty()
    summary: string;

    @ApiProperty()
    @IsOptional()
    description: string;

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