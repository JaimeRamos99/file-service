import { cleanEnv, json, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  DB_HOST_DEV: str(),
  DB_NAME_DEV: str(),
  DB_PASSWORD_DEV: str(),
  DB_USER_DEV: str(),
  FILES_MANAGER_CLIENT_SERVICE_KEY: json(),
  GCP_DOCUMENTAI_LOCATION: str(),
  GCP_DOCUMENTAI_PROCESSOR_ID: str(),
  GCP_PROJECT_ID: str(),
  GCSCONFIG: json(),
  NODE_ENV: str(),
  PORT: num(),
  UPLOAD_TEMP_FOLDER_NAME: str(),
});
