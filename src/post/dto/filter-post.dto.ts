import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FilterPostDto {
    @IsOptional()
    @ApiProperty()
    page: string;

    @IsOptional()
    @ApiProperty()
    limit: string;

    @IsOptional()
    @ApiProperty()
    search: string;

    @IsOptional()
    @ApiProperty()
    category: string
}