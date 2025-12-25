import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  priceUSD: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPriceUSD?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;
}