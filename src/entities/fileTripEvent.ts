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

export type FileUploadInput = {
  fileTypeId: string;
  tripId?: string;
  tripEventId?: string;
  userId: string;
};
