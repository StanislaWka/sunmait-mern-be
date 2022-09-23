import { EndpointSchema } from '../interfaces';
import { buildResponse, schemaErrorExample } from '../utils/schemaResponseExamples';
import { RESPONSE_CODE } from '../constants';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const MAX_TITLE_LENGTH = 50;
const MAX_TEXT_LENGTH = 250;

const createPostSchema: EndpointSchema = {
  body: Joi.object({
    title: Joi.string().max(MAX_TITLE_LENGTH).required(),
    text: Joi.string().max(MAX_TEXT_LENGTH).required(),
    tags: Joi.array(),
    userId: Joi.objectId().required(),
    viewsCount: Joi.number(),
    imageUrl: Joi.string().uri(),
  }),
  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Post was created successful',
      }),
      swaggerOptions: {
        description: 'Post Creation',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getDeleteWithIdSchema: EndpointSchema = {
  params: Joi.object({
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    id: Joi.objectId().required(),
  }),

  response: {
    200: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'get/post was successful',
      }),
      swaggerOptions: {
        description: 'Registration',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const patchPostSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.objectId().required(),
  }),

  body: Joi.object({
    title: Joi.string().max(MAX_TITLE_LENGTH),
    text: Joi.string().max(MAX_TEXT_LENGTH),
    tags: Joi.array(),
    viewsCount: Joi.number(),
    imageUrl: Joi.string().uri(),
  }),
  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Post was edited successful',
      }),
      swaggerOptions: {
        description: 'Post Creation',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

export default {
  createPost: createPostSchema,
  getDeleteWithId: getDeleteWithIdSchema,
  patchPost: patchPostSchema,
};
