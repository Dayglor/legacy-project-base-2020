import 'reflect-metadata';
import { init } from './testBootstrap';

beforeAll(async () => {
	await init({
		synchronize: false,
	});
});
