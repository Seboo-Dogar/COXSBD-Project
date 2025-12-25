import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateVisaToCountryDto {
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country!: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;

  @IsNotEmpty({ message: 'Nicename is required' })
  @IsString({ message: 'Nicename must be a string' })
  nicename!: string;

  @IsNotEmpty({ message: 'ISO code is required' })
  @IsString({ message: 'ISO code must be a string' })
  iso!: string;
}

export class UpdateVisaToCountryDto {
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'Nicename must be a string' })
  nicename?: string;

  @IsOptional()
  @IsString({ message: 'ISO code must be a string' })
  iso?: string;
}

