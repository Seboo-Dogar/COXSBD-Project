import {
  IsString,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class BrandingBaseDto {
  @IsOptional()
  @IsString({ message: 'Business logo must be a string' })
  businessLogo?: string;

  @IsOptional()
  @IsString({ message: 'Favicon must be a string' })
  favicon?: string;

  @IsOptional()
  @IsString({ message: 'Homepage cover must be a string' })
  homepageCover?: string;
}

export class CreateBrandingDto extends BrandingBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateBrandingDto {
  @IsOptional()
  @IsString({ message: 'Business logo must be a string' })
  businessLogo?: string;

  @IsOptional()
  @IsString({ message: 'Favicon must be a string' })
  favicon?: string;

  @IsOptional()
  @IsString({ message: 'Homepage cover must be a string' })
  homepageCover?: string;
}

