import { cleanEnv, json, num, str } from 'envalid'

export const env = cleanEnv(
    process.env,
    {
        GCP_DOCUMENTAI_LOCATION: str(),
        GCP_DOCUMENTAI_PROCESSOR_ID: str(),
        GCP_PROJECT_ID: str(),
        GCSCONFIG: json(),
        PORT: num(),
        UPLOAD_TEMP_FOLDER_NAME: str()
    }
)