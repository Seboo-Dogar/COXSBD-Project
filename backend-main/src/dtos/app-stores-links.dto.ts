import {
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class AppStoresLinksBaseDto {
  @IsOptional()
  @IsString({ message: 'Android store link must be a string' })
  androidStoreLink?: string;

  @IsOptional()
  @IsString({ message: 'IOS store link must be a string' })
  iosStoreLink?: string;

  @IsOptional()
  @IsBoolean({ message: 'Show apps must be a boolean' })
  showApps?: boolean;
}

export class CreateAppStoresLinksDto extends AppStoresLinksBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateAppStoresLinksDto {
  @IsOptional()
  @IsString({ message: 'Android store link must be a string' })
  androidStoreLink?: string;

  @IsOptional()
  @IsString({ message: 'IOS store link must be a string' })
  iosStoreLink?: string;

  @IsOptional()
  @IsBoolean({ message: 'Show apps must be a boolean' })
  showApps?: boolean;
}

