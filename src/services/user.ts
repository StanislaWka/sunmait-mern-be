import bcrypt from 'bcryptjs';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { tokenService } from './tokenService';
import { createError } from '../utils/errors';

class UserService {
  private readonly salt = 12;
  async registration(email: string, password: string, name: string, surname: string) {
    try {
      const candidate = await User.findOne({ email }).lean();

      if (candidate) {
        throw new createError.UnprocessableEntity({
          data: { message: 'User with this email is exist' },
        });
      }

      const employeeRole = await Role.findOne({ name: 'employee' });

      if (!employeeRole) {
        throw new createError.InternalServerError();
      }

      const hashPassword = await bcrypt.hash(password, this.salt);

      const user = new User({
        email,
        password: hashPassword,
        name,
        surname,
        roleId: employeeRole._id,
      });

      await user.save();

      return { message: 'User is created' };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async login(email: string, userPassword: string) {
    try {
      const candidate = await User.findOne({ email }).populate('roleId').lean();

      if (!candidate) {
        throw new createError.UnprocessableEntity({
          data: { message: 'Incorrect password or login' },
        });
      }

      const originalPassword = await bcrypt.compare(userPassword, candidate.password);

      if (!originalPassword) {
        throw new createError.UnprocessableEntity({
          data: { message: 'Incorrect password or login' },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, _id, ...userData } = candidate;

      const tokenData = tokenService.generateTokens({
        _id: _id.toString(),
        ...userData,
      });
      await tokenService.saveToken(_id.toString(), tokenData.refreshToken);

      return { _id, ...userData, tokenData };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getUsers() {
    try {
      const result = await User.find().lean();

      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new UserService();
