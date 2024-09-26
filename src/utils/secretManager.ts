import { cleanEnv, json, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  CACHE_TTL_MS_SIGNED_URL: num(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_USER: str(),
  DB_PORT: num(),
  FILES_MANAGER_CLIENT_SERVICE_KEY: json(),
  GCP_DOCUMENTAI_LOCATION: str(),
  GCP_DOCUMENTAI_PROCESSOR_ID: str(),
  GCP_PROJECT_ID: str(),
  GCSCONFIG: json<{ bucketName: string; options: Record<string, string> }>(),
  NODE_ENV: str(),
  FILE_SERVICE_PORT: num(),
});
