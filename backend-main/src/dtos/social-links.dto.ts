import {
  IsString,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class SocialLinksBaseDto {
  @IsOptional()
  @IsString({ message: 'Facebook must be a string' })
  facebook?: string;

  @IsOptional()
  @IsString({ message: 'Twitter must be a string' })
  twitter?: string;

  @IsOptional()
  @IsString({ message: 'LinkedIn must be a string' })
  linkedin?: string;

  @IsOptional()
  @IsString({ message: 'Instagram must be a string' })
  instagram?: string;

  @IsOptional()
  @IsString({ message: 'Google must be a string' })
  google?: string;

  @IsOptional()
  @IsString({ message: 'Youtube must be a string' })
  youtube?: string;

  @IsOptional()
  @IsString({ message: 'WhatsApp must be a string' })
  whatsapp?: string;
}

export class CreateSocialLinksDto extends SocialLinksBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateSocialLinksDto {
  @IsOptional()
  @IsString({ message: 'Facebook must be a string' })
  facebook?: string;

  @IsOptional()
  @IsString({ message: 'Twitter must be a string' })
  twitter?: string;

  @IsOptional()
  @IsString({ message: 'LinkedIn must be a string' })
  linkedin?: string;

  @IsOptional()
  @IsString({ message: 'Instagram must be a string' })
  instagram?: string;

  @IsOptional()
  @IsString({ message: 'Google must be a string' })
  google?: string;

  @IsOptional()
  @IsString({ message: 'Youtube must be a string' })
  youtube?: string;

  @IsOptional()
  @IsString({ message: 'WhatsApp must be a string' })
  whatsapp?: string;
}

