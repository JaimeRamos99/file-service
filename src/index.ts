import express from "express";
import { filesRouter } from "./routes/";
import { env } from "./utils";

const app = express();

app.use("/files", filesRouter);

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
