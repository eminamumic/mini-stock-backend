import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UsePipes,
  Body,
  ValidationPipe,
  Get,
  Param,
  NotFoundException,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SearchLocationDto } from './dto/search-location.dto';
import { Location } from 'src/entities/location/location';

@Controller('locations')
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

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async search(
    @Query() searchLocationDto: SearchLocationDto,
  ): Promise<Location[]> {
    return this.locationService.searchLocation(searchLocationDto);
  }

  @Get('zip/:zipCode')
  @HttpCode(HttpStatus.OK)
  async findByZipCode(@Param('zipCode') zipCode: string): Promise<Location[]> {
    const locations = await this.locationService.getLocationsByZipCode(zipCode);
    if (locations.length === 0) {
      throw new NotFoundException(
        `Locations with zip code ${zipCode} not found.`,
      );
    }
    return locations;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<Location> {
    const location = await this.locationService.getLocationById(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found.`);
    }
    return location;
  }

  @Get(':id/relations')
  @HttpCode(HttpStatus.OK)
  async findOneWithRelations(@Param('id') id: number): Promise<Location> {
    const location = await this.locationService.getLocationWithAllRelations(id);
    if (!location) {
      throw new NotFoundException(
        `Location with ID ${id} (with relations) not found.`,
      );
    }
    return location;
  }

  @Get('cities')
  @HttpCode(HttpStatus.OK)
  async getCities(): Promise<string[]> {
    return this.locationService.getDistinctCities();
  }

  @Get('states')
  @HttpCode(HttpStatus.OK)
  async getStates(): Promise<string[]> {
    return this.locationService.getDistinctStates();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const updatedLocation = await this.locationService.updateLocation(
      id,
      updateLocationDto,
    );
    if (!updatedLocation) {
      throw new NotFoundException(`Location with ID ${id} not found.`);
    }
    return updatedLocation;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const deleted = await this.locationService.deleteLocation(id);
    if (!deleted) {
      throw new NotFoundException(`Location with ID ${id} not found.`);
    }
  }
}
