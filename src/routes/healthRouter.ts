import express from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  res.status(200).send({ status: 'UP' });
});

export default healthRouter;
