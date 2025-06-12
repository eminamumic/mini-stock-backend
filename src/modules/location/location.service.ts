import { AppDataSource } from 'src/data-source';
import { Location } from 'src/entities/location/location';
import { Like } from 'typeorm';

export class LocationService {
  private locationRepository = AppDataSource.getRepository(Location);

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const newLocation = this.locationRepository.create(locationData);
    const savedLocation = await this.locationRepository.save(newLocation);
    return savedLocation;
  }

  async getAllLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async searchLocation(searchCriteria: {
    id?: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    note?: string;
  }): Promise<Location[]> {
    const whereClause: any = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.city) {
      whereClause.city = searchCriteria.city;
    }
    if (searchCriteria.state) {
      whereClause.state = searchCriteria.state;
    }
    if (searchCriteria.zipCode) {
      whereClause.zipCode = searchCriteria.zipCode;
    }
    if (searchCriteria.address) {
      whereClause.address = Like(`%${searchCriteria.address}%`);
    }
    if (searchCriteria.note) {
      whereClause.note = Like(`%${searchCriteria.note}%`);
    }

    return this.locationRepository.find({
      where: whereClause,
      relations: ['warehouses'],
    });
  }