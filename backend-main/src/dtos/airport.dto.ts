import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class AirportBaseDto {
  @IsNotEmpty({ message: 'Airport code is required' })
  @IsString({ message: 'Code must be a string' })
  code!: string;

  @IsNotEmpty({ message: 'Airport name is required' })
  @IsString({ message: 'Airport name must be a string' })
  airport!: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city!: string;

  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country!: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class CreateAirportDto extends AirportBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateAirportDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Airport name must be a string' })
  airport?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

