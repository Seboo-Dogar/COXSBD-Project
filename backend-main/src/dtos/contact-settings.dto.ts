import {
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class ContactSettingsBaseDto {
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Address on map must be a string' })
  addressOnMap?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be a valid email' })
  contactEmail?: string;

  @IsOptional()
  @IsString({ message: 'Contact phone must be a string' })
  contactPhone?: string;
}

export class CreateContactSettingsDto extends ContactSettingsBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateContactSettingsDto {
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Address on map must be a string' })
  addressOnMap?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be a valid email' })
  contactEmail?: string;

  @IsOptional()
  @IsString({ message: 'Contact phone must be a string' })
  contactPhone?: string;
}

