import express from 'express';
import webRouter from './web/web.routes';

const appRouter = express.Router();

appRouter.use('/web', webRouter);

export default appRouter;
