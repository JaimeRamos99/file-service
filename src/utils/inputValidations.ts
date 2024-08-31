import { FileTypes } from '../entities';

// Type Guard Function
export function isValidFileType(value: any): value is FileTypes {
  return Object.values(FileTypes).includes(value);
}
