import { EndpointSchema } from '../interfaces';
import { buildResponse, schemaErrorExample } from '../utils/schemaResponseExamples';
import { RESPONSE_CODE } from '../constants';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const MAX_TAG_LENGTH = 50;

const createTagSchema: EndpointSchema = {
  body: Joi.object({
    name: Joi.string().max(MAX_TAG_LENGTH).required(),
  }),
  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'TAG was created successful',
      }),
      swaggerOptions: {
        description: 'TAG Creation',
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
        description: 'GD',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const patchTagSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.objectId().required(),
  }),

  body: Joi.object({
    name: Joi.string().max(MAX_TAG_LENGTH),
  }),
  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Tag was edited successful',
      }),
      swaggerOptions: {
        description: 'Tag Creation',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

export default {
  createTag: createTagSchema,
  getDeleteWithId: getDeleteWithIdSchema,
  patchTag: patchTagSchema,
};
