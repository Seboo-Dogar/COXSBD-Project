import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { CurrencyCode } from '@prisma/client';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class TourBaseDto {
  @IsNotEmpty({ message: 'Tour type ID is required' })
  @IsString({ message: 'Tour type ID must be a string' })
  tourTypeId!: string;

  @IsNotEmpty({ message: 'Tour name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId!: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString({ message: 'Location must be a string' })
  location!: string;

  @IsNotEmpty({ message: 'Adult price is required' })
  @IsNumber({}, { message: 'Adult price must be a number' })
  @Min(0, { message: 'Adult price must be 0 or greater' })
  adultPrice!: number;

  @IsNotEmpty({ message: 'Child price is required' })
  @IsNumber({}, { message: 'Child price must be a number' })
  @Min(0, { message: 'Child price must be 0 or greater' })
  childPrice!: number;

  @IsNotEmpty({ message: 'Max adults is required' })
  @IsNumber({}, { message: 'Max adults must be a number' })
  @Min(1, { message: 'Max adults must be at least 1' })
  maxAdults!: number;

  @IsNotEmpty({ message: 'Max child is required' })
  @IsNumber({}, { message: 'Max child must be a number' })
  @Min(0, { message: 'Max child must be 0 or greater' })
  maxChild!: number;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description!: string;

  @IsNotEmpty({ message: 'Policy is required' })
  @IsString({ message: 'Policy must be a string' })
  policy!: string;

  @IsOptional()
  @IsEnum(CurrencyCode, { message: 'Currency must be a valid CurrencyCode' })
  currency?: CurrencyCode;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Featured must be a boolean' })
  featured?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Refundable must be a boolean' })
  refundable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Offer must be a boolean' })
  offer?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Stars must be a number' })
  @Min(0, { message: 'Stars must be 0 or greater' })
  @Max(5, { message: 'Stars must be 5 or less' })
  stars?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating must be 0 or greater' })
  @Max(5, { message: 'Rating must be 5 or less' })
  rating?: number;

  @IsOptional()
  @IsArray({ message: 'Inclusions must be an array' })
  @IsString({ each: true, message: 'Each inclusion ID must be a string' })
  inclusions?: string[];

  @IsOptional()
  @IsArray({ message: 'Exclusions must be an array' })
  @IsString({ each: true, message: 'Each exclusion ID must be a string' })
  exclusions?: string[];
}

export class CreateTourDto extends TourBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateTourDto {
  @IsOptional()
  @IsString({ message: 'Tour type ID must be a string' })
  tourTypeId?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Adult price must be a number' })
  @Min(0, { message: 'Adult price must be 0 or greater' })
  adultPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Child price must be a number' })
  @Min(0, { message: 'Child price must be 0 or greater' })
  childPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Max adults must be a number' })
  @Min(1, { message: 'Max adults must be at least 1' })
  maxAdults?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Max child must be a number' })
  @Min(0, { message: 'Max child must be 0 or greater' })
  maxChild?: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Policy must be a string' })
  policy?: string;

  @IsOptional()
  @IsEnum(CurrencyCode, { message: 'Currency must be a valid CurrencyCode' })
  currency?: CurrencyCode;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Featured must be a boolean' })
  featured?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Refundable must be a boolean' })
  refundable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Offer must be a boolean' })
  offer?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Stars must be a number' })
  @Min(0, { message: 'Stars must be 0 or greater' })
  @Max(5, { message: 'Stars must be 5 or less' })
  stars?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating must be 0 or greater' })
  @Max(5, { message: 'Rating must be 5 or less' })
  rating?: number;

  @IsOptional()
  @IsArray({ message: 'Inclusions must be an array' })
  @IsString({ each: true, message: 'Each inclusion ID must be a string' })
  inclusions?: string[];

  @IsOptional()
  @IsArray({ message: 'Exclusions must be an array' })
  @IsString({ each: true, message: 'Each exclusion ID must be a string' })
  exclusions?: string[];
}

