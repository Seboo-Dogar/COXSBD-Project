import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class LanguageCurrenciesBaseDto {
  @IsOptional()
  @IsBoolean({ message: 'Multi language must be a boolean' })
  multiLanguage?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Multi currency must be a boolean' })
  multiCurrency?: boolean;
}

export class CreateLanguageCurrenciesDto extends LanguageCurrenciesBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateLanguageCurrenciesDto {
  @IsOptional()
  @IsBoolean({ message: 'Multi language must be a boolean' })
  multiLanguage?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Multi currency must be a boolean' })
  multiCurrency?: boolean;
}

