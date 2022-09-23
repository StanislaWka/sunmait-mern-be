import express from 'express';
import { POST_ROUTE } from '../constants/routes';
import { checkAuthMiddleware } from '../middlewares/checkAuth';
import { schemaValidator } from '../middlewares/schemaValidator';
import controller from '../controllers/post';
import schema from '../validators/post';

const router = express.Router();

router.post(
  POST_ROUTE.MAIN,
  checkAuthMiddleware,
  schemaValidator(schema.createPost),
  // @ts-ignore
  controller.createPost,
);

router.get(POST_ROUTE.MAIN, checkAuthMiddleware, controller.getAllPosts);

router.get(
  POST_ROUTE.MAIN_WITH_ID,
  checkAuthMiddleware,
  schemaValidator(schema.getDeleteWithId),
  // @ts-ignore
  controller.getOnePost,
);

router.patch(
  POST_ROUTE.MAIN_WITH_ID,
  checkAuthMiddleware,
  schemaValidator(schema.patchPost),
  // @ts-ignore
  controller.updatePost,
);

router.delete(
  POST_ROUTE.MAIN_WITH_ID,
  checkAuthMiddleware,
  schemaValidator(schema.getDeleteWithId),
  // @ts-ignore
  controller.deletePost,
);

export default router;
