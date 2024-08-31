import { FileTypes } from './fileType';

export interface IFileTripEvent {
  file_trip_event_id?: string;
  file_id?: string;
  trip_id?: string;
  trip_event_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export type UploadInput = Pick<IFileTripEvent, 'trip_id' | 'trip_event_id'> & { file_type: FileTypes };
