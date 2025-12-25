import { IsDateString, IsInt, IsPositive, IsString } from 'class-validator';

export class BookRoomsDto {
  @IsString()
  userId: string;

  @IsDateString()
  checkIn: Date;

  @IsDateString()
  checkOut: Date;

  @IsInt()
  @IsPositive()
  numberOfRooms: number;
}