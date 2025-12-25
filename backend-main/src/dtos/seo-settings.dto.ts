import {
  IsString,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class SeoSettingsBaseDto {
  @IsOptional()
  @IsString({ message: 'Meta title must be a string' })
  metaTitle?: string;

  @IsOptional()
  @IsString({ message: 'Meta description must be a string' })
  metaDescription?: string;

  @IsOptional()
  @IsString({ message: 'XML sitemap must be a string' })
  xmlSitemap?: string;
}

export class CreateSeoSettingsDto extends SeoSettingsBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateSeoSettingsDto {
  @IsOptional()
  @IsString({ message: 'Meta title must be a string' })
  metaTitle?: string;

  @IsOptional()
  @IsString({ message: 'Meta description must be a string' })
  metaDescription?: string;

  @IsOptional()
  @IsString({ message: 'XML sitemap must be a string' })
  xmlSitemap?: string;
}

