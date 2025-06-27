import { Request, Response } from 'express';
import { TripService } from '../services/tripService';
import { wrapAsyncController } from './wrapAsyncController';
import { sendResponse, calculateOffsetAndLimit } from '../utils';
import { StatusCodes } from 'http-status-codes';
import { CreateTripInput, UpdateTripInput } from '../entities';

export default class TripController {
  constructor(private tripService: TripService) {
    this.tripService = tripService;
  }

  public createTrip = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const tripData: CreateTripInput = req.body;
    const userId = res.locals.user.sub;

    // Validate required fields
    if (!tripData.trip_name || !tripData.initial_date) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'Missing required fields: trip_name and initial_date',
        null,
        true,
      );
    }

    const newTrip = await this.tripService.createTrip({
      ...tripData,
      user_id: userId,
    });

    return sendResponse(res, StatusCodes.CREATED, 'Trip created successfully', newTrip, false);
  });

  public getTripById = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { id: tripId } = req.params;

    const trip = await this.tripService.getTripById(tripId);
    return sendResponse(res, StatusCodes.OK, 'Trip retrieved successfully', trip, false);
  });

  public getUserTrips = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { page, pageSize } = req.query;
    const { offset, limit } = calculateOffsetAndLimit(page as string, pageSize as string);
    const userId = res.locals.user.sub;

    const result = await this.tripService.getUserTrips(userId, offset, limit);

    return sendResponse(
      res,
      StatusCodes.OK,
      'Trips retrieved successfully',
      {
        trips: result.trips,
        pagination: {
          total: result.total,
          page: Number(page) || 1,
          pageSize: Number(pageSize) || 10,
          totalPages: Math.ceil(result.total / (Number(pageSize) || 10)),
        },
      },
      false,
    );
  });

  public updateTrip = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { id: tripId } = req.params;
    const tripData: UpdateTripInput = req.body;
    const userId = res.locals.user.sub;

    const updatedTrip = await this.tripService.updateTrip(tripId, tripData, userId);
    return sendResponse(res, StatusCodes.OK, 'Trip updated successfully', updatedTrip, false);
  });

  public deleteTrip = wrapAsyncController(async (req: Request, res: Response): Promise<Response> => {
    const { id: tripId } = req.params;

    await this.tripService.deleteTrip(tripId);
    return sendResponse(res, StatusCodes.NO_CONTENT, '', null, false);
  });
}
