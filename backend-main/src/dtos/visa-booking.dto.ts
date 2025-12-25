import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { VisaStatus } from '@prisma/client';

export class CreateVisaBookingDto {
  @IsOptional()
  @IsEnum(VisaStatus, { message: 'Status must be one of: WAITING, PROGRESS, DONE' })
  status?: VisaStatus;

  @IsNotEmpty({ message: 'From country ID is required' })
  @IsString({ message: 'From country ID must be a string' })
  fromCountryId!: string;

  @IsNotEmpty({ message: 'To country ID is required' })
  @IsString({ message: 'To country ID must be a string' })
  toCountryId!: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid date string' })
  date!: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName!: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone!: string;

  @IsNotEmpty({ message: 'Days is required' })
  @IsInt({ message: 'Days must be an integer' })
  @Min(1, { message: 'Days must be at least 1' })
  days!: number;

  @IsNotEmpty({ message: 'Entry type is required' })
  @IsString({ message: 'Entry type must be a string' })
  entryType!: string;

  @IsNotEmpty({ message: 'Visa type is required' })
  @IsString({ message: 'Visa type must be a string' })
  visaType!: string;
}

export class UpdateVisaBookingDto {
  @IsOptional()
  @IsEnum(VisaStatus, { message: 'Status must be one of: WAITING, PROGRESS, DONE' })
  status?: VisaStatus;

  @IsOptional()
  @IsString({ message: 'From country ID must be a string' })
  fromCountryId?: string;

  @IsOptional()
  @IsString({ message: 'To country ID must be a string' })
  toCountryId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid date string' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @IsOptional()
  @IsInt({ message: 'Days must be an integer' })
  @Min(1, { message: 'Days must be at least 1' })
  days?: number;

  @IsOptional()
  @IsString({ message: 'Entry type must be a string' })
  entryType?: string;

  @IsOptional()
  @IsString({ message: 'Visa type must be a string' })
  visaType?: string;
}

