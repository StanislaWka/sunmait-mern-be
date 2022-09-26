import express from 'express';
import { USER_ROUTES } from '../constants/routes';
import { checkAuthMiddleware } from '../middlewares/checkAuth';
import { schemaValidator } from '../middlewares/schemaValidator';
import controller from '../controllers/user';
import schema from '../validators/users';

const router = express.Router();
// @ts-ignore
router.get(USER_ROUTES.MAIN, checkAuthMiddleware, controller.getUsers);

router.post(
  USER_ROUTES.REGISTRATION,
  schemaValidator(schema.registration),
  // @ts-ignore
  controller.registration,
);
// @ts-ignore
router.post(USER_ROUTES.LOGIN, schemaValidator(schema.login), controller.login);

export default router;
