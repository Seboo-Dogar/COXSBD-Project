import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class FlightFeaturedBaseDto {
  @IsNotEmpty({ message: 'Airline ID is required' })
  @IsString({ message: 'Airline ID must be a string' })
  airlineId!: string;

  @IsNotEmpty({ message: 'From Airport ID is required' })
  @IsString({ message: 'From Airport ID must be a string' })
  fromAirportId!: string;

  @IsNotEmpty({ message: 'To Airport ID is required' })
  @IsString({ message: 'To Airport ID must be a string' })
  toAirportId!: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price!: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class CreateFlightFeaturedDto extends FlightFeaturedBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateFlightFeaturedDto {
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
  @IsNumber({}, { message: 'Price must be a number' })
  price?: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

