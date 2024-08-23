import express from 'express';
import { env } from './utils'

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`)
});