import { IBaseEntity } from './common';

export interface IFileTripEvent extends IBaseEntity {
  file_id?: string;
  trip_id?: string;
  trip_event_id?: string;
}

export type FileUploadInput = {
  fileTypeId: string;
  tripId?: string;
  tripEventId?: string;
  userId: string;
};
