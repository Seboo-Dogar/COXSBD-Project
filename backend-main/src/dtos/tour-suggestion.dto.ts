import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class TourSuggestionBaseDto {
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city!: string;

  @IsNotEmpty({ message: 'Order is required' })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be 0 or greater' })
  order!: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class CreateTourSuggestionDto extends TourSuggestionBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateTourSuggestionDto {
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be 0 or greater' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

