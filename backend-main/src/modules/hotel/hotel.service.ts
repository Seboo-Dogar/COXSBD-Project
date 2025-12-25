// src/hotel/hotel.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { HotelApiProvider, Prisma } from '@prisma/client';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { DatabaseService } from '../database/database.service';
import { SearchHotelsDto } from './dto/search-hotel.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class HotelService {
  constructor(
    private readonly databaseService: DatabaseService,
    private httpService: HttpService
  ) { }
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  async createHotel(createHotelDto: CreateHotelDto) {
    return this.databaseService.hotel.create({
      data: {
        ...createHotelDto,
        rooms: {
          createMany: {
            data: createHotelDto.rooms.map(room => ({
              ...room,
              price: new Prisma.Decimal(room.price),
              quantity: room.quantity || 30, // Default quantity if not provided
            })),
          },
        },
      },
      include: { rooms: true },
    });
  }

  async updateHotel(id: string, updateHotelDto: UpdateHotelDto) {
    const { rooms, ...hotelData } = updateHotelDto;

    const updateOperations = [];

    // Update hotel fields
    updateOperations.push(
      this.databaseService.hotel.update({
        where: { id },
        data: hotelData,
      }),
    );

    // Process room updates
    if (rooms) {
      rooms.forEach(room => {
        if (room.id) {
          // Update existing room
          updateOperations.push(
            this.databaseService.room.update({
              where: { id: room.id },
              data: {
                ...room,
                price: new Prisma.Decimal(room.price),
                hotelId: undefined, // Prevent changing hotel association
                id: undefined, // Prevent ID change
              },
            }),
          );
        } else {
          // Create new room
          updateOperations.push(
            this.databaseService.room.create({
              data: {
                hotelId: id,
                amenities: room.amenities,
                capacity: room.capacity,
                description: room.description,
                quantity: room.quantity || 30, // Default quantity if not provided
                price: new Prisma.Decimal(room.price),
                type: room.type,
                currency: room.currency
              },
            }),
          );
        }
      });
    }

    return this.databaseService.$transaction(updateOperations);
  }

  async deleteHotel(id: string) {
    return this.databaseService.$transaction([
      this.databaseService.room.deleteMany({ where: { hotelId: id } }),
      this.databaseService.hotel.delete({ where: { id } }),
    ]);
  }

  async getHotelById(id: string) {
    return this.databaseService.hotel.findUnique({
      where: { id },
      include: { rooms: true },
    });
  }

  async getHotels(
    skip?: number,
    take?: number,
    where?: Prisma.HotelWhereInput,
    orderBy?: Prisma.HotelOrderByWithRelationInput,
  ) {
    return this.databaseService.hotel.findMany({
      skip,
      take,
      where,
      include: { rooms: true },
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async getFeaturedHotels(take: number = 10) {
    return this.databaseService.hotel.findMany({
      where: { featured: true },
      take,
      include: { rooms: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchHotels(query: string, location?: string) {
    return this.databaseService.hotel.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
        ...(location && { locationName: { contains: location } }),
      },
      include: { rooms: true },
    });
  }

  async setHotelEnabled(id: string, enabled: boolean) {
    return this.databaseService.hotel.update({
      where: { id },
      data: { enabled },
    });
  }

  async setHotelFeatured(id: string, featured: boolean) {
    return this.databaseService.hotel.update({
      where: { id },
      data: { featured },
    });
  }

  // NEW: Search hotels with availability check
  async searchHotelsWithAvailability(searchDto: SearchHotelsDto) {
    const { query, location } = searchDto;
    const checkIn = new Date(searchDto.checkIn);
    const checkOut = new Date(searchDto.checkOut);
    console.log('Searching hotels with query:', query, 'location:', location);
    // Find matching hotels
    const hotels = await this.databaseService.hotel.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { locationName: { contains: query } },
        ],
      },
      include: {
        rooms: true,
      },
    });

    console.log('Found hotels:', hotels.length);

    // Get room type IDs for availability check
    const roomTypeIds = hotels.flatMap(hotel =>
      hotel.rooms.map(room => room.id)
    );

    // Get booked room counts for the date range
    const bookedRooms = await this.databaseService.booking.groupBy({
      by: ['roomTypeId'],
      _sum: { numberOfRooms: true },
      where: {
        roomTypeId: { in: roomTypeIds },
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkOut } },
              { checkOut: { gte: checkIn } },
            ],
          },
        ],
      },
    });

    // Create map of roomTypeId -> booked count
    const bookedMap = new Map(
      bookedRooms.map(item => [item.roomTypeId, item._sum.numberOfRooms || 0])
    );

    // Calculate availability and return results
    return hotels.map(hotel => ({
      ...hotel,
      rooms: hotel.rooms.map(room => {
        const booked = bookedMap.get(room.id) || 0;
        const available = Math.max(0, room.quantity - booked);
        return {
          ...room,
          available,
        };
      }),
    }));
  }

  // NEW: Book rooms by type
  async bookRooms(
    userId: string,
    hotelId: string,
    roomTypeId: string,
    checkIn: Date,
    checkOut: Date,
    numberOfRooms: number
  ) {
    // Check room availability
    const available = await this.getRoomAvailability(roomTypeId, checkIn, checkOut);
    if (available < numberOfRooms) {
      throw new ConflictException(
        `Only ${available} rooms available for this type`
      );
    }

    // Get room details for pricing
    const room = await this.databaseService.room.findUnique({
      where: { id: roomTypeId },
    });

    // Calculate price
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = Number(room.price) * nights * numberOfRooms;

    // Create booking
    return this.databaseService.booking.create({
      data: {
        userId,
        hotelId,
        roomTypeId,
        checkIn,
        checkOut,
        numberOfRooms,
        totalPrice,
        status: 'PENDING',
      },
    });
  }

  // NEW: Check room availability helper
  private async getRoomAvailability(
    roomTypeId: string,
    checkIn: Date,
    checkOut: Date
  ) {
    const room = await this.databaseService.room.findUnique({
      where: { id: roomTypeId },
      select: { quantity: true },
    });

    const bookedResult = await this.databaseService.booking.aggregate({
      _sum: { numberOfRooms: true },
      where: {
        roomTypeId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkOut } },
              { checkOut: { gte: checkIn } },
            ],
          },
        ],
      },
    });

    const booked = bookedResult._sum.numberOfRooms || 0;
    return Math.max(0, room.quantity - booked);
  }

   async getAllActiveProviders() {
    return this.databaseService.hotelApiProvider.findMany({
      where: { isActive: true },
    });
  }

  async getProviderBySlug(slug: string) {
    return this.databaseService.hotelApiProvider.findUnique({
      where: { slug },
    });
  }

  async searchAllHotels(filters: {
    checkIn: string;
    checkOut: string;
    occupancies: any[];
    geolocation: {
      latitude: number;
      longitude: number;
      radius: number;
      unit: string;
    };
  }) {
    const providers = await this.getAllActiveProviders();
    
    const results = await Promise.all(
      providers.map(provider => 
        this.searchWithProvider(provider, filters)
          .catch(e => {
            console.error(`[${provider.slug}] API Error:`, e.response?.data || e.message);
            return []; // Return empty array on failure
          })
      )
    );

    return results.flat();
  }

  private async searchWithProvider(
    provider: any,
    filters: {
      checkIn: string;
      checkOut: string;
      occupancies: any[];
      geolocation: any;
    }
  ) {
    // 1. Prepare authentication headers
    const headers = this.getAuthHeaders(provider);
    
    // 2. Prepare request body
    const requestBody = {
      stay: {
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
      },
      occupancies: filters.occupancies,
      geolocation: filters.geolocation
    };

    // 3. Determine endpoint URL
    const endpoint ='/hotels';
    const url = `${provider.credentials.baseUrl}${endpoint}`;

    // 4. Execute API request
    const response = await firstValueFrom(
      this.httpService.post(url, requestBody, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10-second timeout
      })
    );

    // 5. Process and standardize response
    return this.standardizeResponse(response.data, provider.slug);
  }

  private getAuthHeaders(provider: any) {
    const { authMethod, credentials } = provider;
    
    switch (authMethod) {
      case 'x_signature':
        const timestamp = Math.floor(Date.now() / 1000);
        return {
          'Api-key': credentials.apiKey,
          'X-Signature': CryptoJS.SHA256(
            credentials.apiKey + credentials.secret + timestamp
          ).toString(CryptoJS.enc.Hex),
          'X-Timestamp': timestamp.toString()
        };
      
      case 'api_key':
        return { 'Authorization': `Bearer ${credentials.apiKey}` };
      
      case 'basic_auth':
        const encoded = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
        return { 'Authorization': `Basic ${encoded}` };
        
      default:
        return {};
    }
  }

  private standardizeResponse(responseData: any, source: string) {
    // Handle different response structures
    const hotels = responseData.hotels?.hotels || 
                   responseData.results?.hotels || 
                   responseData.data?.hotels || 
                   [];
    
    return hotels.map(hotel => ({
      // Hotel fields
      id: `${source}_${hotel.code || hotel.id}`,
      name: hotel.name,
      description: hotel.description || `${hotel.categoryName} hotel in ${hotel.destinationName}`,
      stars: this.parseStarRating(hotel.categoryCode, hotel.categoryName),
      featuredImage: this.getFeaturedImage(hotel),
      gallery: this.getImageGallery(hotel),
      locationName: `${hotel.destinationName || ''}, ${hotel.zoneName || ''}`.trim(),
      lat: parseFloat(hotel.latitude) || 0,
      lng: parseFloat(hotel.longitude) || 0,
      source: source,
      minRate: parseFloat(hotel.minRate) || 0,
      maxRate: parseFloat(hotel.maxRate) || 0,
      currency: hotel.currency || 'USD',
      
      // Room mapping
      rooms: this.mapRooms(hotel.rooms, source, hotel.currency)
    }));
  }

  private parseStarRating(categoryCode: string, categoryName: string): number {
    // Try to extract from code (e.g., "5EST" -> 5)
    const codeMatch = categoryCode?.match(/\d+/);
    if (codeMatch) return parseInt(codeMatch[0]);
    
    // Try to extract from name (e.g., "5 Stars" -> 5)
    const nameMatch = categoryName?.match(/\d+/);
    return nameMatch ? parseInt(nameMatch[0]) : 3;
  }

  private getFeaturedImage(hotel: any): string {
    if (hotel.images?.length > 0) return hotel.images[0].url;
    if (hotel.media?.mainImage) return hotel.media.mainImage;
    return '';
  }

  private getImageGallery(hotel: any): string[] {
    if (hotel.images?.length > 0) return hotel.images.map(img => img.url);
    if (hotel.media?.gallery) return hotel.media.gallery.map(img => img.url);
    return [];
  }

  private mapRooms(rooms: any[], source: string, currency: string) {
    if (!rooms) return [];
    
    return rooms.flatMap(room => {
      if (!room.rates) return [];
      
      return room.rates.map(rate => ({
        id: `${source}_${room.code}_${rate.rateKey}`,
        type: room.name,
        description: `${room.name} - ${rate.boardName || ''}`.trim(),
        price: parseFloat(rate.net) || 0,
        originalPrice: parseFloat(rate.net) + Math.abs(parseFloat(rate.offers?.[0]?.amount || 0)),
        currency: currency || 'USD',
        capacity: (rate.adults || 1) + (rate.children || 0),
        amenities: this.getRoomAmenities(rate),
        quantity: rate.allotment || 10,
        cancellationPolicy: rate.cancellationPolicies?.[0]?.amount
          ? parseFloat(rate.cancellationPolicies[0].amount)
          : null,
        offers: rate.offers?.map(o => ({
          code: o.code,
          name: o.name,
          amount: parseFloat(o.amount) || 0
        })) || []
      }));
    });
  }

  private getRoomAmenities(rate: any): string[] {
    const amenities = [];
    if (rate.boardName) amenities.push(rate.boardName);
    if (rate.packaging) amenities.push('Package deal');
    if (rate.freeCancellation) amenities.push('Free cancellation');
    if (rate.breakfastIncluded) amenities.push('Breakfast included');
    return amenities;
  }

  async getCoordinates(location: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.NOMINATIM_URL, {
          params: {
            q: location,
            format: 'json',
            limit: 1,
            addressdetails: 1
          },
          headers: {
            'User-Agent': 'MyHotelApp/1.0'
          }
        })
      );

      console.log('Geocoding response:', response.data);

      if (response.data?.length > 0) {
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon),
          address: response.data[0].display_name
        };
      }
      return null;
    } catch (e) {
      console.error('Geocoding error:', e);
      return null;
    }
  }
}