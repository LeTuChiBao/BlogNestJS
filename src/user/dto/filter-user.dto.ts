import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FilterUserDto{
    @ApiProperty()
    @IsOptional()
    page: string;

    @ApiProperty()
    @IsOptional()
    limit: string;
    
    @IsOptional()
    @ApiProperty()
    search: string
}