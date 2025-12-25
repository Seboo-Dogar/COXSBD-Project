import { IsDateString, IsOptional, IsString } from 'class-validator';

export class SearchHotelsDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  checkIn: string;

  @IsString()
  checkOut: string;
}