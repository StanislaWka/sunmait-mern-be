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

// responsible for locating interfaces with data
// added to `res.locals`
//
// Usage example:
// const controller = (req: Request, res: Response<any, ResponseLocals.AuthenticatedUser>) => {
//   const { userId } = res.locals;
// };
export namespace ResponseLocals {
  export interface AuthenticatedUser {
    userId: number;
  }
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface DialectOptions {
  ssl: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}
