import jwt from 'jsonwebtoken';
import { Token } from '../../models/Token';
import { User } from '../../models/User';
import { jwtTimestamps } from '../constants';
import { createError } from '../utils/errors';
require('dotenv').config();

class TokenService {
  private readonly _jwtAccessSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
  private readonly _jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_TOKEN;

  generateTokens(payload: Omit<UserAttributes, 'password'>): {
    refreshToken: string;
    accessToken: string;
  } {
    try {
      const accessToken = jwt.sign(payload, this._jwtAccessSecret as jwt.Secret, {
        expiresIn: jwtTimestamps.accessExpiresIn,
      });
      const refreshToken = jwt.sign(payload, this._jwtRefreshSecret as jwt.Secret, {
        expiresIn: jwtTimestamps.refreshTokenExpiresInSec,
      });
      return { accessToken, refreshToken };
    } catch (e) {
      throw e;
    }
  }
  async saveToken(userId: string, refreshToken: string): Promise<typeof Token | unknown> {
    try {
      const tokenExists = await Token.findOne();
      if (tokenExists) {
        tokenExists.refreshToken = refreshToken;
        return tokenExists.save();
      }
      const token = await Token.create({ user: userId, refreshToken });
      return token;
    } catch (e) {
      throw e;
    }
  }
  async removeToken(refreshToken: string): Promise<unknown> {
    try {
      return await Token.deleteOne({ where: { refreshToken } });
    } catch (e) {
      throw e;
    }
  }
  async findToken(refreshToken: string): Promise<typeof Token | null> {
    try {
      return await Token.findOne({ where: { refreshToken } });
    } catch (e) {
      throw e;
    }
  }
  validateAccessToken(accessToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TokenData>jwt.verify(accessToken, this._jwtAccessSecret as jwt.Secret);
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TokenData>jwt.verify(refreshToken, this._jwtRefreshSecret as jwt.Secret);
    } catch (e) {
      return null;
    }
  }
  async refresh(refreshToken: string): Promise<TokenData> {
    try {
      if (!refreshToken) {
        throw new createError.Unauthenticated();
      }
      const userData = this.validateRefreshToken(refreshToken);
      const token = await this.findToken(refreshToken);

      if (!userData || !token) {
        throw new createError.Unauthenticated();
      }

      const result = await User.findById(userData._id);
      if (!result) {
        throw new createError.InternalServerError();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user }: UserAttributes = result.toObject();
      const tokenData = this.generateTokens({ ...user });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.saveToken(user!._id, tokenData.refreshToken);
      return {
        ...user,
        tokenData,
      } as TokenData;
    } catch (e) {
      throw e;
    }
  }

  getUserId(token: string) {
    try {
      const data = jwt.decode(token);
      const { id } = data as { id: string };

      return id;
    } catch (e) {
      throw e;
    }
  }
}
export const tokenService = new TokenService();

interface UserAttributes {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

type TokenData = Omit<UserAttributes, 'password'>;
