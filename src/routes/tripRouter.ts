import express from 'express';
import { TripController } from '../controllers';
import { TripService } from '../services';

const tripRouter = express.Router();

const tripController = new TripController(new TripService());

// Create a new trip
tripRouter.post('', tripController.createTrip);

// Get all trips for the authenticated user
tripRouter.get('', tripController.getUserTrips);

// Get a specific trip by ID
tripRouter.get('/:id', tripController.getTripById);

// Update a trip
tripRouter.put('/:id', tripController.updateTrip);

// Delete a trip (soft delete)
tripRouter.delete('/:id', tripController.deleteTrip);

export default tripRouter;
