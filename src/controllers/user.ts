import { Request, Response } from 'express';
import userService from '../services/user';
import { cookieOption } from '../constants';
import { LoginBody, RegistrationBody } from './interfaces';

class UsersController {
  async registration(req: Request<null, null, RegistrationBody>, res: Response) {
    const { email, password, name, surname } = req.body;

    const result = await userService.registration(email, password, name, surname);

    res.send(result);
  }

  async login(req: Request<null, null, LoginBody>, res: Response) {
    const { email, password } = req.body;

    const result = await userService.login(email, password);

    res.cookie('refreshToken', result.tokenData.refreshToken, cookieOption);

    // @ts-ignore
    delete result.tokenData.refreshToken;

    res.send(result);
  }

  async getUsers(req: Request, res: Response) {
    const result = await userService.getUsers();

    res.send(result);
  }
}

export default new UsersController();
