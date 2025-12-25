import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { SearchHotelsDto } from './dto/search-hotel.dto';
import { BookRoomsDto } from './dto/book-rooms.dto';


@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);
  }

  @Put(':id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return await this.hotelService.updateHotel(id, updateHotelDto);
  }

  @Delete(':id')
  async deleteHotel(@Param('id') id: string) {
    return await this.hotelService.deleteHotel(id);
  }

  @Get(':id')
  async getHotelById(@Param('id') id: string) {
    return await this.hotelService.getHotelById(id);
  }

  @Get()
  async getHotels(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('search') search?: string,
    @Query('location') location?: string,
  ) {
    if (search || location) {
      return await this.hotelService.searchHotels(search || '', location);
    }
    return await this.hotelService.getHotels(skip, take);
  }

  @Get('featured')
  async getFeaturedHotels(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return await this.hotelService.getFeaturedHotels(take);
  }

   // NEW: Search hotels with availability
  @Get('search/availability')
  async searchHotels(@Query() searchDto: SearchHotelsDto) {
    console.log('Search DTO:', searchDto);
    // Convert string dates to Date objects
    const checkIn = new Date(searchDto.checkIn);
    const checkOut = new Date(searchDto.checkOut);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }
    return this.hotelService.searchHotelsWithAvailability(searchDto);
  }

  @Post('search-all')
  async searchAllHotels(@Body() searchDto: {
    query: string;
    location?: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
  }) {
    // Convert location to coordinates
    let geolocation = null;
    if (searchDto.location) {
      const coords = await this.hotelService.getCoordinates(searchDto.location);
      if (coords) {
        geolocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          radius: 20,
          unit: 'km'
        };
      }
    }

    // Prepare API filters
    const filters = {
      checkIn: searchDto.checkIn,
      checkOut: searchDto.checkOut,
      occupancies: [{
        rooms: searchDto.rooms || 1,
        adults: searchDto.adults || 2,
        children: searchDto.children || 0
      }],
      geolocation
    };

    // Search local and external hotels
    const [localHotels, externalHotels] = await Promise.all([
      this.hotelService.searchHotels(searchDto.query, searchDto.location),
      this.hotelService.searchAllHotels(filters)
    ]);

    return {
      meta: { 
        localCount: localHotels.length,
        externalCount: externalHotels.length
      },
      results: [...localHotels, ...externalHotels]
    };
  }

  // NEW: Book rooms by type
  @Post(':hotelId/room-types/:roomTypeId/book')
  async bookRooms(
    @Param('hotelId') hotelId: string,
    @Param('roomTypeId') roomTypeId: string,
    @Body() bookDto: BookRoomsDto
  ) {
    return this.hotelService.bookRooms(
      bookDto.userId,
      hotelId,
      roomTypeId,
      bookDto.checkIn,
      bookDto.checkOut,
      bookDto.numberOfRooms
    );
  }

  @Put(':id/set-featured')
  async setHotelFeatured(
    @Param('id') id: string,
    @Body('featured') featured: boolean,
  ) {
    return await this.hotelService.setHotelFeatured(id, featured);
  }

  @Put(':id/set-enabled')
  async setHotelEnabled(
    @Param('id') id: string,
    @Body('enabled') enabled: boolean,
  ) {
    return await this.hotelService.setHotelEnabled(id, enabled);
  }
}