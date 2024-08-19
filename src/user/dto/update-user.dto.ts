import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@src/role/entites/role.entity";
import { IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Category } from "src/category/entities/category.entity";

export class UpdateUserDto {

    @ApiProperty()
    @IsOptional()
    firstName : string;

    @ApiProperty()
    @IsOptional()
    lastName : string;

    @ApiProperty()
    @IsOptional()
    status: number;

    @ApiProperty()
    @IsNotEmpty()
    role: Role;
}