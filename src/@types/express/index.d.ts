import { User as MyUser } from '@infrastructure/database/entities/User';

/* eslint-disable @typescript-eslint/naming-convention */
declare global {
	namespace Express {
		export interface Request {
			currentUser: MyUser;
		}
	}
}
