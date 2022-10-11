import express from 'express';
import { TAG_ROUTE } from '../constants/routes';
import { checkAuthMiddleware } from '../middlewares/checkAuth';
import { schemaValidator } from '../middlewares/schemaValidator';
import controller from '../controllers/tags';
import schema from '../validators/tags';

const router = express.Router();

router.post(
  TAG_ROUTE.MAIN,
  checkAuthMiddleware,
  schemaValidator(schema.createTag),
  // @ts-ignore
  controller.createTag,
);

router.get(TAG_ROUTE.MAIN, checkAuthMiddleware, controller.getAllTags);

router.patch(
  TAG_ROUTE.MAIN_WITH_ID,
  checkAuthMiddleware,
  schemaValidator(schema.patchTag),
  // @ts-ignore
  controller.updateTag,
);

router.delete(
  TAG_ROUTE.MAIN_WITH_ID,
  checkAuthMiddleware,
  schemaValidator(schema.getDeleteWithId),
  // @ts-ignore
  controller.deleteTag,
);

export default router;
