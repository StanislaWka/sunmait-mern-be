import { Request, Response } from 'express';
import userService from './service';
import { cookieOption } from '../../constants';

class UsersController {
  async registration(req: Request, res: Response) {
    try {
      const { email, password, name, surname } = req.body;

      const result = await userService.registration(email, password, name, surname);

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async login(req: Request, res: Response) {
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
