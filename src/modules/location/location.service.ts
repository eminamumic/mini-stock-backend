import { AppDataSource } from 'src/data-source';
import { Location } from 'src/entities/location/location';

export class LocationService {
  private locationRepository = AppDataSource.getMongoRepository(Location);

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const newLocation = this.locationRepository.create(locationData);
    const savedLocation = await this.locationRepository.save(newLocation);
    return savedLocation;
  }
}
