import { cleanEnv, json, num } from 'envalid'

export const env = cleanEnv(
    process.env,
    {
        GCSCONFIG: json(),
        PORT: num()
    }
)