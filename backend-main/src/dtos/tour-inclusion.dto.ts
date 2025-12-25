import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class TourInclusionBaseDto {
  @IsNotEmpty({ message: 'Tour inclusion name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;
}

export class CreateTourInclusionDto extends TourInclusionBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateTourInclusionDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
}

