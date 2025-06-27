import { IBaseEntity } from './common';

export interface ITrip extends IBaseEntity {
  trip_name?: string;
  trip_description?: string;
  trip_status?: string;
  initial_date?: string;
  end_date?: string;
  user_id?: string;
}

export type CreateTripInput = Omit<ITrip, keyof IBaseEntity>;

export type UpdateTripInput = CreateTripInput & {
  updated_by?: string;
};
