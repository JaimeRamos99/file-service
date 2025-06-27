import { IBaseEntity } from './common';

export interface IFile extends IBaseEntity {
  file_original_name?: string;
  file_unique_name?: string;
  file_type_id?: string;
  file_extension?: string;
  file_size?: number;
  file_hash?: string;
  user_id?: string;
}
