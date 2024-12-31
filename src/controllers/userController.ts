import { Request, Response } from 'express';
import { UsersService } from '../services/userService';

const userService = new UsersService();

export class UserController {
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getUsers();
            res.status(201).json({ message: 'Users fetched successfully.', data: users });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
