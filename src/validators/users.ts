import Joi from 'joi';

import { faker } from '@faker-js/faker';
import { EndpointSchema } from '../interfaces';
import { buildResponse, schemaErrorExample } from '../utils/schemaResponseExamples';
import { RESPONSE_CODE } from '../constants';

const MAX_NAME_LENGTH = 11;
const MAX_SURNAME_LENGTH = 14;
const MAX_PASSWORD_LENGTH = 8;

const registrationSchema: EndpointSchema = {
  body: Joi.object({
    name: Joi.string().max(MAX_NAME_LENGTH).required(),
    surname: Joi.string().max(MAX_SURNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MAX_PASSWORD_LENGTH).required(),
  }).example({
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),

  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Registration was successful',
      }),
      swaggerOptions: {
        description: 'Registration',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const loginSchema: EndpointSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).example({
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),
  response: {
    200: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Registration was successful',
      }),
      swaggerOptions: {
        description: 'Registration',
      },
    },

    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

export default {
  registration: registrationSchema,
  login: loginSchema,
};
