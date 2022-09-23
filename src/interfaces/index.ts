import * as core from 'express-serve-static-core';
import Joi from 'joi';

export interface ArrayResponse<T> {
  results: T;
  metadata: {
    count: number;
    limit: number;
    offset: number;
    isNewCount?: number;
  };
}

export interface EndpointSchema {
  params?: Joi.Schema;

  body?: Joi.Schema;

  query?: Joi.Schema;

  response: {
    [status: string]: ResponseEndpointSchema;
  };
}

export interface ResponseEndpointSchema {
  schema: Joi.Schema;
  swaggerOptions?: EndpointSchemaSwaggerOptions;
}

export interface EndpointSchemaSwaggerOptions {
  description?: string;
}

export interface DialectOptions {
  ssl: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}

export interface AuthorizedRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>,
> extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  userId: string;
}
