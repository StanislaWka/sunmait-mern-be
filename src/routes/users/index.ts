import express from 'express';
import { USER_ROUTES } from '../../constants/routes';
import { checkAuthMiddleware } from '../../middlewares/checkAuth';
import { schemaValidator } from '../../middlewares/schemaValidator';
import controller from './controller';
import schema from './schema';

const router = express.Router();

router.get(USER_ROUTES.MAIN, checkAuthMiddleware, controller.getUsers);

router.post(
  USER_ROUTES.REGISTRATION,
  schemaValidator(schema.registration),
  controller.registration,
);

router.post(USER_ROUTES.LOGIN, schemaValidator(schema.login), controller.login);

export default router;
