import { cleanEnv, json, num, str } from 'envalid'

export const env = cleanEnv(
    process.env,
    {
        GCSCONFIG: json(),
        PORT: num(),
        UPLOAD_TEMP_FOLDER_NAME: str()
    }
)