import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { 
  IsArray, ValidateNested, IsOptional, IsString 
} from 'class-validator';
import { CreateHotelDto, CreateRoomDto } from './create-hotel.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsString()
  @IsOptional()
  id?: string;
}

export class UpdateHotelDto extends PartialType(
  OmitType(CreateHotelDto, ['rooms'] as const)
) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRoomDto)
  @IsOptional()
  rooms?: UpdateRoomDto[];
}