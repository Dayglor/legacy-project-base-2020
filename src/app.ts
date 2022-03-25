import cors from 'cors';
import format from 'date-fns/format';
import express, { Express } from 'express';
import formData from 'express-form-data';
import http from 'http';
// import jwt from 'jsonwebtoken';
import os from 'os';
// import socket from 'socket.io';
import { Server } from 'socket.io';
import { container } from 'tsyringe';

import initializeLogger from '@infrastructure/utils/logger';

// import { IUserRepository } from '@infrastructure/repositories/IUserRepository';

import { init } from './bootstrap';
import { Authenticate } from './infrastructure/http/Authenticate';

['warn', 'error', 'log'].forEach((a) => {
	const b = console[a];
	console[a] = (...c) => {
		try {
			throw new Error();
		} catch (d) {
			const callstack = [];
			if (d.stack) {
				const lines = d.stack.split('\n');
				for (let i = 0, len = 3; i < len; i += 1) {
					const line = lines[i].trim();
					const indexAt = line.indexOf(' (');
					const fileName = line
						.substring(indexAt)
						.replace(__dirname, '')
						.replace(/\s\(./, ' at ')
						.replace(/\)/, '')
						.split(' at ')[1];

					callstack.push(fileName);
				}
				callstack.shift();
				callstack.shift();
				callstack.reverse();
			}
			b.apply(console, [
				'\x1b[7m\x1b[1m',
				a.toUpperCase(),
				'\x1b[0m\x1b[7m',
				format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
				'\x1b[0m',
				callstack.join(' -> '),
				'\n',
				...c,
				'\n',
			]);
		}
	};
});

// const generateToken = async () => {
// 	try {
// 		const userRepository: IUserRepository = container.resolve('IUserRepository');

// 		const user = await userRepository.findByEmail('admin@zsystems.com.br');

// 		console.log(jwt.sign({ ...user }, process.env.JWT_SECRET));
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const appInit = async (): Promise<Express> => {
	try {
		await init();

		const app = express();

		app.use(cors());
		app.use(express.json());
		app.use(express.urlencoded());

		const options = {
			uploadDir: os.tmpdir(),
			autoClean: true,
		};
		// parse data with connect-multiparty.
		app.use(formData.parse(options));
		// delete from the request all empty files (size == 0)
		app.use(formData.format());
		// union the body and the files
		app.use(formData.union());

		// app.use(express.json());

		const auth: Authenticate = container.resolve('Authenticate');
		app.use(auth.initialize());

		initializeLogger(app);

		app.use(container.resolve('Router'));

		const httpServer = http.createServer(app);
		const io = new Server(httpServer);

		// app.get('/', (req, res) => {
		// 	res.sendFile(`${__dirname}/index.html`);
		// });

		io.on('connection', (client) => {
			console.log(`Socket connected: ${client.id}`);
			client.emit('msg', 'Conectado');
		});

		httpServer.listen(process.env.APP_PORT);
		// app.listen(process.env.APP_PORT);

		console.log(`Running on port ${process.env.APP_PORT}`);

		// await generateToken();

		return app;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export { appInit };
