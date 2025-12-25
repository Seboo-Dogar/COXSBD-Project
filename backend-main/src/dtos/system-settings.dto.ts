import {
  IsString,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class SystemSettingsBaseDto {
  @IsOptional()
  @IsString({ message: 'Tracking script must be a string' })
  trackingScript?: string;
}

export class CreateSystemSettingsDto extends SystemSettingsBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateSystemSettingsDto {
  @IsOptional()
  @IsString({ message: 'Tracking script must be a string' })
  trackingScript?: string;
}

