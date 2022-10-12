import { HTTP_CODE, ROLES } from './../constants/index';
import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errors';
import { RESPONSE_CODE } from '../constants';
import { UserAttributes } from '../services/tokenService';

interface UserData extends Omit<UserAttributes, 'password'> {
  roleId: { _id: string; name: string };
}

const secret = process.env.JWT_ACCESS_SECRET_TOKEN as string;

export const hasAdminRole = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';

  const accessToken = authHeader?.split(' ')[1];

  const userInfo = jwt.verify(accessToken, secret) as UserData;

  const isAdmin = userInfo.roleId.name === ROLES.ADMIN;

  if (isAdmin) {
    next();
  } else {
    const error = new createError.ForbiddenError({ code: RESPONSE_CODE.FORBIDEN_ERROR });
    res.status(HTTP_CODE.FORBIDDEN).json(error.toJSON().response);
  }
};
