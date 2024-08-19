
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@src/role/entites/role.entity";
import { IsEmail, IsIn, IsInt, isNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    firstName : string;

    @ApiProperty()
    @IsNotEmpty()
    lastName : string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsOptional()
    status: number;

    @ApiProperty()
    @IsNotEmpty()
    role: Role;

}