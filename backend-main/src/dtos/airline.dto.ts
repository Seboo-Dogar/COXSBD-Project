import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class AirlineBaseDto {
  @IsNotEmpty({ message: 'IATA code is required' })
  @IsString({ message: 'IATA code must be a string' })
  iata!: string;

  @IsNotEmpty({ message: 'Airline name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Airline code is required' })
  @IsString({ message: 'Code must be a string' })
  code!: string;

  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country!: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class CreateAirlineDto extends AirlineBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateAirlineDto {
  @IsOptional()
  @IsString({ message: 'IATA code must be a string' })
  iata?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

