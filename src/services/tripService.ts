import { ITrip, CreateTripInput, UpdateTripInput } from '../entities';
import { TripRepository } from '../repositories/tripRepository';
import { CustomError } from '../middlewares';
import { StatusCodes } from 'http-status-codes';

export class TripService {
  private tripRepository = new TripRepository();

  async createTrip(tripData: CreateTripInput): Promise<ITrip> {
    // Validate dates
    if (
      tripData.end_date &&
      new Date(tripData.initial_date as string) > new Date(tripData.end_date as string)
    ) {
      throw new CustomError('End date cannot be before initial date', StatusCodes.BAD_REQUEST);
    }

    return this.tripRepository.create(tripData);
  }

  async getTripById(tripId: string): Promise<ITrip> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new CustomError('Trip not found', StatusCodes.NOT_FOUND);
    }
    return trip;
  }

  async getUserTrips(
    userId: string,
    offset: number,
    limit: number,
  ): Promise<{
    trips: ITrip[];
    total: number;
  }> {
    const [trips, total] = await Promise.all([
      this.tripRepository.findByUserId(userId, offset, limit),
      this.tripRepository.countByUserId(userId),
    ]);

    return { trips, total };
  }

  async updateTrip(tripId: string, tripData: UpdateTripInput, userId: string): Promise<ITrip> {
    // Validate dates if both are provided
    if (tripData.initial_date && tripData.end_date) {
      if (new Date(tripData.initial_date) > new Date(tripData.end_date)) {
        throw new CustomError('End date cannot be before initial date', StatusCodes.BAD_REQUEST);
      }
    }

    const updatedTrip = await this.tripRepository.update(tripId, tripData, userId);

    if (!updatedTrip) {
      throw new CustomError('Trip not found', StatusCodes.NOT_FOUND);
    }

    return updatedTrip;
  }

  async deleteTrip(tripId: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip) {
      throw new CustomError('Trip not found', StatusCodes.NOT_FOUND);
    }

    await this.tripRepository.softDelete(tripId);
  }
}
