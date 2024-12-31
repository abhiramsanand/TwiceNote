import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/users';

export class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRES_IN: string;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_EXPIRES_IN = '24h';
    }

    async registerUser(username: string, password: string | 'user' = 'user'): Promise<IUser> {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already registered');
        }

        const user = new User({ username, password });
        return await user.save();
    }

    async loginUser(username: string, password: string): Promise<{ token: string, user: IUser }> {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid username');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Wrong Password');
        }

        const token = this.generateToken(user);
        return { token, user };
    }

    private generateToken(user: IUser): string {
        return jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }
}