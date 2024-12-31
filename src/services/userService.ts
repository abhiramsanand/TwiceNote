import { Schema } from "mongoose";
import { User, IUser } from '../models/users';



export class UsersService {
  
    async getUsers(): Promise<IUser[]> {
        const users = await User.find({}, "username");
        return users;
      }
}
