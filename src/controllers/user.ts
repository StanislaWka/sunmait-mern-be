import { Request, Response } from 'express';
import userService from '../services/user';
import { cookieOption } from '../constants';
import { LoginBody, RegistrationBody } from './interfaces';

class UsersController {
  async registration(req: Request<null, null, RegistrationBody>, res: Response) {
    try {
      const { email, password, name, surname } = req.body;

      const result = await userService.registration(email, password, name, surname);

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async login(req: Request<null, null, LoginBody>, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await userService.login(email, password);

      res.cookie('refreshToken', result.tokenData.refreshToken, cookieOption);

      // @ts-ignore
      delete result.tokenData.refreshToken;

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const result = await userService.getUsers();

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new UsersController();
