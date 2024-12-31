import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }

            const user = await authService.registerUser(username, password);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }

            const { token, user } = await authService.loginUser(username, password);
            res.status(200).json({ token, user });
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}