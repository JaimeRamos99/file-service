import { cleanEnv, json, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  CACHE_TTL_MS_SIGNED_URL: num(),
  DB_HOST_DEV: str(),
  DB_NAME_DEV: str(),
  DB_PASSWORD_DEV: str(),
  DB_USER_DEV: str(),
  FILES_MANAGER_CLIENT_SERVICE_KEY: json(),
  GCP_DOCUMENTAI_LOCATION: str(),
  GCP_DOCUMENTAI_PROCESSOR_ID: str(),
  GCP_PROJECT_ID: str(),
  GCSCONFIG: json<{ bucketName: string; options: Record<string, string> }>(),
  NODE_ENV: str(),
  PORT: num(),
});
