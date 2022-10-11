/* eslint-disable @typescript-eslint/no-inferrable-types */

import { CookieOptions } from 'express';

export const DEFAULT_LIMIT = 100;
export const DEFAULT_OFFSET = 0;

export enum RESPONSE_CODE {
  VALIDATION_ERROR = 'validation_error',
  FORBIDEN_ERROR = 'forbiden_error',
}

export const STRING_LENGTHS = {
  SMALL: 32,
  MEDIUM: 64,
  LARGE: 128,
};

export enum ROLES {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export enum HTTP_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ORDER {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_VIEWED = 'mostViewed',
}

export const jwtTimestamps = {
  accessExpiresIn: '60m',
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  refreshTokenExpiresInSec: 60 * 60 * 24 * 30,
};

export const cookieOption: CookieOptions = {
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV !== 'development',
  httpOnly: true,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  maxAge: jwtTimestamps.refreshTokenExpiresInSec * 1000, // cast to ms
};
