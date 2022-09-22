import express from 'express';
import users from './users';
import serverStatus from './serverStatus';
import { globalErrorHandler } from '../middlewares/globalErrorHandler';

import { USERS_ROUTE } from './../constants/routes';
import { POSTS_ROUTE } from './../constants/routes';
import posts from './posts';

export default (app: express.Application) => {
  app.use(USERS_ROUTE, users);
  app.use(POSTS_ROUTE, posts);
  app.use('/', serverStatus);
  app.use(globalErrorHandler);
};
