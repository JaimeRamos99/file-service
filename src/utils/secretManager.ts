import { cleanEnv, json, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  CACHE_KEY_PREFIX_FILE_ATTRIBUTES: str(),
  CACHE_KEY_PREFIX_SIGNED_URL: str(),
  CACHE_TTL_MS_FILE_ATTRIBUTES: num(),
  CACHE_TTL_MS_SIGNED_URL: num(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_USER: str(),
  FILE_SERVICE_PORT: num(),
  FILES_MANAGER_CLIENT_SERVICE_KEY: json(),
  GCP_DOCUMENTAI_LOCATION: str(),
  GCP_DOCUMENTAI_PROCESSOR_ID: str(),
  GCP_PROJECT_ID: str(),
  GCSCONFIG: json<{ bucketName: string; options: Record<string, string> }>(),
  JWT_SECRET: str(),
  NODE_ENV: str(),
});
