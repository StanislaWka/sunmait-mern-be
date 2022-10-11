import express from 'express';
import users from './user';
import serverStatus from './serverStatus';
import { globalErrorHandler } from '../middlewares/globalErrorHandler';

import { TAGS_ROUTE, USERS_ROUTE } from './../constants/routes';
import { POSTS_ROUTE } from './../constants/routes';
import posts from './post';
import tags from './tags';

export default (app: express.Application) => {
  app.use(USERS_ROUTE, users);
  app.use(POSTS_ROUTE, posts);
  app.use(TAGS_ROUTE, tags);
  app.use('/', serverStatus);
  app.use(globalErrorHandler);
};
