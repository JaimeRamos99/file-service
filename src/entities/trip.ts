import { IBaseEntity } from './common';

export interface ITrip extends IBaseEntity {
  user_id?: string;
  trip_name?: string;
  trip_description?: string;
  trip_status?: string;
  start_date?: string;
  end_date?: string;
}
