import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  Min,
} from 'class-validator';
import { SuggestionType } from '@prisma/client';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class FlightSuggestionBaseDto {
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(SuggestionType, { message: 'Type must be a valid SuggestionType (FROM_DESTINATION or TO_DESTINATION)' })
  type!: SuggestionType;

  @IsNotEmpty({ message: 'City/Airport is required' })
  @IsString({ message: 'City/Airport must be a string' })
  cityAirport!: string;

  @IsNotEmpty({ message: 'Order is required' })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be 0 or greater' })
  order!: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class CreateFlightSuggestionDto extends FlightSuggestionBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateFlightSuggestionDto {
  @IsOptional()
  @IsEnum(SuggestionType, { message: 'Type must be a valid SuggestionType (FROM_DESTINATION or TO_DESTINATION)' })
  type?: SuggestionType;

  @IsOptional()
  @IsString({ message: 'City/Airport must be a string' })
  cityAirport?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be 0 or greater' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

