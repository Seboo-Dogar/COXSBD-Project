// src/hotel/dto/create-hotel.dto.ts
import { Currency } from '@prisma/client';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsInt, 
  IsBoolean, 
  IsArray, 
  IsUrl, 
  IsEmail, 
  IsPhoneNumber, 
  IsNumber, 
  Min, 
  Max, 
  ValidateNested, 
  IsOptional, 
  IsNotEmpty,
  IsPositive
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  @Max(10)
  capacity: number;

  @IsString()
  currency: Currency;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsUrl()
  featuredImage: string;

  @IsArray()
  @IsUrl({}, { each: true })
  gallery: string[];

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  facebook?: string;

  @IsUrl()
  @IsOptional()
  twitter?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateRoomDto)
  rooms: CreateRoomDto[];
}