import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class TourExclusionBaseDto {
  @IsNotEmpty({ message: 'Tour exclusion name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;
}

export class CreateTourExclusionDto extends TourExclusionBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateTourExclusionDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
}

