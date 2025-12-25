import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { FlightType } from '@prisma/client';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class FlightBaseDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId!: string;

  @IsNotEmpty({ message: 'Airline ID is required' })
  @IsString({ message: 'Airline ID must be a string' })
  airlineId!: string;

  @IsNotEmpty({ message: 'From Airport ID is required' })
  @IsString({ message: 'From Airport ID must be a string' })
  fromAirportId!: string;

  @IsNotEmpty({ message: 'To Airport ID is required' })
  @IsString({ message: 'To Airport ID must be a string' })
  toAirportId!: string;

  @IsNotEmpty({ message: 'Adult seat price is required' })
  @IsNumber({}, { message: 'Adult seat price must be a number' })
  adultSeatPrice!: number;

  @IsNotEmpty({ message: 'Child price is required' })
  @IsNumber({}, { message: 'Child price must be a number' })
  childPrice!: number;

  @IsNotEmpty({ message: 'Infant price is required' })
  @IsNumber({}, { message: 'Infant price must be a number' })
  infantPrice!: number;

  @IsNotEmpty({ message: 'Duration is required' })
  @IsString({ message: 'Duration must be a string' })
  duration!: string;

  @IsNotEmpty({ message: 'Departure time is required' })
  @IsDateString({}, { message: 'Departure time must be a valid date string' })
  departureTime!: string;

  @IsNotEmpty({ message: 'Arrival time is required' })
  @IsDateString({}, { message: 'Arrival time must be a valid date string' })
  arrivalTime!: string;

  @IsNotEmpty({ message: 'Baggage is required' })
  @IsString({ message: 'Baggage must be a string' })
  baggage!: string;

  @IsNotEmpty({ message: 'Cabin baggage is required' })
  @IsString({ message: 'Cabin baggage must be a string' })
  cabinBaggage!: string;

  @IsOptional()
  @IsEnum(FlightType, { message: 'Type must be a valid FlightType' })
  type?: FlightType;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Refundable must be a boolean' })
  refundable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Offer must be a boolean' })
  offer?: boolean;
}

export class CreateFlightDto extends FlightBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateFlightDto {
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @IsOptional()
  @IsString({ message: 'Airline ID must be a string' })
  airlineId?: string;

  @IsOptional()
  @IsString({ message: 'From Airport ID must be a string' })
  fromAirportId?: string;

  @IsOptional()
  @IsString({ message: 'To Airport ID must be a string' })
  toAirportId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Adult seat price must be a number' })
  adultSeatPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Child price must be a number' })
  childPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Infant price must be a number' })
  infantPrice?: number;

  @IsOptional()
  @IsString({ message: 'Duration must be a string' })
  duration?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Departure time must be a valid date string' })
  departureTime?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Arrival time must be a valid date string' })
  arrivalTime?: string;

  @IsOptional()
  @IsString({ message: 'Baggage must be a string' })
  baggage?: string;

  @IsOptional()
  @IsString({ message: 'Cabin baggage must be a string' })
  cabinBaggage?: string;

  @IsOptional()
  @IsEnum(FlightType, { message: 'Type must be a valid FlightType' })
  type?: FlightType;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Refundable must be a boolean' })
  refundable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Offer must be a boolean' })
  offer?: boolean;
}

