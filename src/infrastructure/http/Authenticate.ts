import { Handler, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import passportJWT, { Strategy } from 'passport-jwt';
import { autoInjectable, inject } from 'tsyringe';

import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

@autoInjectable()
export class Authenticate {
	private readonly jwtSecret: string = process.env.JWT_SECRET;
	private readonly jwtSession: any = { session: false };
	private readonly strategy: Strategy;

	constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {
		const { ExtractJwt } = passportJWT;
		const { Strategy } = passportJWT;

		this.strategy = new Strategy(
			{
				secretOrKey: this.jwtSecret,
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			},
			async (payload, done) => {
				const user = await this.userRepository.findById(payload.id);
				if (user) {
					return done(null, user);
				}
				return done('Authentication failed', null);
			}
		);
		passport.use(this.strategy);
	}

	initialize(): Handler {
		return passport.initialize();
	}

	authenticate(request: Request, response: Response, next: NextFunction): any {
		return passport.authenticate('jwt', (err, user) => {
			if (err) return next(err);

			request.currentUser = null;

			if (user) {
				request.currentUser = user;
				return next();
			}

			return response.status(400).json({ success: false, message: 'Authentication failed.' });
		})(request, response, next);
	}
}
