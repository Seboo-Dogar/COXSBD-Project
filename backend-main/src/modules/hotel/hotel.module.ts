import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports:[
    HttpModule.register({}),
    HotelModule,
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
