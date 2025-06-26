import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UsePipes,
  Body,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from 'src/entities/location/location';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Location[]> {
    return this.locationService.getAllLocations();
  }
}
