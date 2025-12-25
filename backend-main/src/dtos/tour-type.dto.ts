import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class TourTypeBaseDto {
  @IsNotEmpty({ message: 'Tour type name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;
}

export class CreateTourTypeDto extends TourTypeBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateTourTypeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
}

