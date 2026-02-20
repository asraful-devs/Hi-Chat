import type { Request } from 'express';
import type { IUser } from './user.type.ts';

export interface AuthRequest extends Request {
    user?: IUser;
}
