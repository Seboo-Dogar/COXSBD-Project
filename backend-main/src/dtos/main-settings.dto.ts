import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ThemeName } from '@prisma/client';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class MainSettingsBaseDto {
  @IsNotEmpty({ message: 'Business name is required' })
  @IsString({ message: 'Business name must be a string' })
  businessName!: string;

  @IsNotEmpty({ message: 'Domain name is required' })
  @IsString({ message: 'Domain name must be a string' })
  domainName!: string;

  @IsNotEmpty({ message: 'License key is required' })
  @IsString({ message: 'License key must be a string' })
  licenseKey!: string;

  @IsNotEmpty({ message: 'Default color is required' })
  @IsString({ message: 'Default color must be a string' })
  defaultColor!: string;

  @IsOptional()
  @IsBoolean({ message: 'Website offline must be a boolean' })
  websiteOffline?: boolean;

  @IsOptional()
  @IsString({ message: 'Offline message must be a string' })
  offlineMessage?: string;

  @IsOptional()
  @IsEnum(ThemeName, { message: 'Theme name must be a valid ThemeName' })
  themeName?: ThemeName;
}

export class CreateMainSettingsDto extends MainSettingsBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateMainSettingsDto {
  @IsOptional()
  @IsString({ message: 'Business name must be a string' })
  businessName?: string;

  @IsOptional()
  @IsString({ message: 'Domain name must be a string' })
  domainName?: string;

  @IsOptional()
  @IsString({ message: 'License key must be a string' })
  licenseKey?: string;

  @IsOptional()
  @IsString({ message: 'Default color must be a string' })
  defaultColor?: string;

  @IsOptional()
  @IsBoolean({ message: 'Website offline must be a boolean' })
  websiteOffline?: boolean;

  @IsOptional()
  @IsString({ message: 'Offline message must be a string' })
  offlineMessage?: string;

  @IsOptional()
  @IsEnum(ThemeName, { message: 'Theme name must be a valid ThemeName' })
  themeName?: ThemeName;
}

