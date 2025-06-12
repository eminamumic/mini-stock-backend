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

 async getLocationById(id: number): Promise<Location | null> {
  return this.locationRepository.findOne({ where: { id } });
}

  async updateLocation(id: number, locationData: Partial<Location>): Promise<Location | null> {
    const locationToUpdate = await this.locationRepository.findOneBy({ id });

    if (!locationToUpdate) {
      return null;
    }

    Object.assign(locationToUpdate, locationData);

    return this.locationRepository.save(locationToUpdate);
  }

  async deleteLocation(id: number): Promise<boolean> {
    const deleteResult = await this.locationRepository.delete(id);
    return deleteResult.affected > 0;
  }

  async getLocationsByZipCode(zipCode: string): Promise<Location[]> {
    return this.locationRepository.find({
      where: { zipCode: zipCode },
      relations: ['warehouses'],
    });
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