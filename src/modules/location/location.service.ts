import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Location } from 'src/entities/location/location';
import { SearchLocationDto } from './dto/search-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const newLocation = this.locationRepository.create(locationData);
    const savedLocation = await this.locationRepository.save(newLocation);
    return savedLocation;
  }

  async getAllLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async getLocationById(id: number): Promise<Location | null> {
    return this.locationRepository.findOne({ where: { id } });
  }

  async getLocationsByZipCode(zipCode: string): Promise<Location[]> {
    return this.locationRepository.find({
      where: { zipCode: zipCode },
    });
  }

  async getLocationWithAllRelations(id: number): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id },
      relations: ['warehouse', 'supplier'],
    });
  }

  async searchLocation(searchCriteria: SearchLocationDto): Promise<Location[]> {
    const whereClause: FindOptionsWhere<Location> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.address) {
      whereClause.address = Like(`%${searchCriteria.address}%`);
    }
    if (searchCriteria.city) {
      whereClause.city = Like(`%${searchCriteria.city}%`);
    }
    if (searchCriteria.state) {
      whereClause.state = Like(`%${searchCriteria.state}%`);
    }
    if (searchCriteria.zipCode) {
      whereClause.zipCode = searchCriteria.zipCode;
    }
    if (searchCriteria.note) {
      whereClause.note = Like(`%${searchCriteria.note}%`);
    }

    return this.locationRepository.find({
      where: whereClause,
      relations: ['warehouse'],
    });
  }

  async updateLocation(
    id: number,
    locationData: Partial<Location>,
  ): Promise<Location | null> {
    const locationToUpdate = await this.locationRepository.findOne({
      where: { id },
    });

    if (!locationToUpdate) {
      return null;
    }

    this.locationRepository.merge(locationToUpdate, locationData);
    const updatedLocation =
      await this.locationRepository.save(locationToUpdate);

    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<boolean> {
    const deleteResult = await this.locationRepository.delete(id);

    return deleteResult.affected !== 0;
  }

  async getDistinctCities(): Promise<string[]> {
    const locations = await this.locationRepository.find({ select: ['city'] });
    const cities = new Set(locations.map((location) => location.city));
    return Array.from(cities);
  }

  async getDistinctStates(): Promise<string[]> {
    const locations = await this.locationRepository.find({ select: ['state'] });
    const states = new Set(locations.map((location) => location.state));
    return Array.from(states);
  }

  async getDistinctZipCodes(): Promise<string[]> {
    const locations = await this.locationRepository.find({
      select: ['zipCode'],
    });
    const zipCodes = new Set(locations.map((location) => location.zipCode));
    return Array.from(zipCodes);
  }
}
