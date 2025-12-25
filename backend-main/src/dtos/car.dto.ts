import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  ValidateIf
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class CarBaseDto {
  @IsNotEmpty({ message: 'Car name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Car model is required' })
  @IsString({ message: 'Model must be a string' })
  model!: string;

  @IsNotEmpty({ message: 'Year is required' })
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(1900, { message: 'Year must be 1900 or later' })
  @Max(new Date().getFullYear() + 1, { message: 'Year cannot be in the future' })
  year!: number;

  @IsArray({ message: 'Features must be an array' })
  @IsString({ each: true, message: 'Each feature must be a string' })
  @ArrayMinSize(1, { message: 'Features list cannot be empty' })
  features!: string[]; 

  @IsNotEmpty({ message: 'Price string is required' })
  @IsString({ message: 'Price must be a string (e.g., "$55/day")' })
  price!: string;

  @IsNotEmpty({ message: 'Numeric price is required' })
  @IsNumber({}, { message: 'Numeric price must be a number' })
  @Min(0.01, { message: 'Price must be greater than zero' })
  numericPrice!: number;

  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating cannot be negative' })
  @Max(5, { message: 'Rating cannot be greater than 5' })
  rating!: number;

  @IsNotEmpty({ message: 'Transmission is required' })
  @IsString({ message: 'Transmission must be a string' })
  transmission!: string;

  @IsNotEmpty({ message: 'Seats are required' })
  @IsNumber({}, { message: 'Seats must be a number' })
  @Min(1, { message: 'Seats must be at least 1' })
  seats!: number;

  @IsNotEmpty({ message: 'Fuel type is required' })
  @IsString({ message: 'Fuel type must be a string' })
  fuelType!: string;

  @IsOptional()
  @IsBoolean({ message: 'Available must be a boolean' })
  available?: boolean;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  category!: string;

  @IsNotEmpty({ message: 'Mileage is required' })
  @IsString({ message: 'Mileage must be a string' })
  mileage!: string;

  @IsNotEmpty({ message: 'Reviews count is required' })
  @IsNumber({}, { message: 'Reviews must be a number' })
  @Min(0, { message: 'Reviews count cannot be negative' })
  reviews!: number;

  @IsOptional()
  @ValidateIf(o => o.originalPrice !== null)
  @IsString({ message: 'Original price must be a string' })
  originalPrice?: string | null;

  @IsOptional()
  @ValidateIf(o => o.discount !== null)
  @IsString({ message: 'Discount must be a string' })
  discount?: string | null;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  img?: string;
}

export class CreateCarDto extends CarBaseDto {}

// ===================================================================
// UPDATE DTO (Explicitly defined with @IsOptional)
// ===================================================================
export class UpdateCarDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Model must be a string' })
  model?: string;
  
  @IsOptional()
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(1900, { message: 'Year must be 1900 or later' })
  @Max(new Date().getFullYear() + 1, { message: 'Year cannot be in the future' })
  year?: number;

  @IsOptional()
  @IsArray({ message: 'Features must be an array' })
  @IsString({ each: true, message: 'Each feature must be a string' })
  @ArrayMinSize(1, { message: 'Features list cannot be empty' })
  features?: string[]; 

  @IsOptional()
  @IsString({ message: 'Price must be a string' })
  price?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Numeric price must be a number' })
  @Min(0.01, { message: 'Price must be greater than zero' })
  numericPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating cannot be negative' })
  @Max(5, { message: 'Rating cannot be greater than 5' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'Transmission must be a string' })
  transmission?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Seats must be a number' })
  @Min(1, { message: 'Seats must be at least 1' })
  seats?: number;

  @IsOptional()
  @IsString({ message: 'Fuel type must be a string' })
  fuelType?: string;

  @IsOptional()
  @IsBoolean({ message: 'Available must be a boolean' })
  available?: boolean;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Mileage must be a string' })
  mileage?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Reviews must be a number' })
  @Min(0, { message: 'Reviews count cannot be negative' })
  reviews?: number;

  @IsOptional()
  @ValidateIf(o => o.originalPrice !== null)
  @IsString({ message: 'Original price must be a string' })
  originalPrice?: string | null;

  @IsOptional()
  @ValidateIf(o => o.discount !== null)
  @IsString({ message: 'Discount must be a string' })
  discount?: string | null;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  img?: string;
}