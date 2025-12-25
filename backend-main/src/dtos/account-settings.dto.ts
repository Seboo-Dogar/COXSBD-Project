import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

// ===================================================================
// BASE DTO (Used for Creation)
// ===================================================================
class AccountSettingsBaseDto {
  @IsOptional()
  @IsBoolean({ message: 'Guest booking must be a boolean' })
  guestBooking?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Users registration must be a boolean' })
  usersRegistration?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Suppliers registration must be a boolean' })
  suppliersRegistration?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Agents registration must be a boolean' })
  agentsRegistration?: boolean;
}

export class CreateAccountSettingsDto extends AccountSettingsBaseDto {}

// ===================================================================
// UPDATE DTO (All fields optional)
// ===================================================================
export class UpdateAccountSettingsDto {
  @IsOptional()
  @IsBoolean({ message: 'Guest booking must be a boolean' })
  guestBooking?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Users registration must be a boolean' })
  usersRegistration?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Suppliers registration must be a boolean' })
  suppliersRegistration?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Agents registration must be a boolean' })
  agentsRegistration?: boolean;
}

