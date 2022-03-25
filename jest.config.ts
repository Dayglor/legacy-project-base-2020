/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import { compilerOptions } from './tsconfig.json';

// console.log(compilerOptions.paths);
export default {
	preset: 'ts-jest',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
		'^.+\\.js?$': 'babel-jest',
	},
	verbose: true,
	clearMocks: true,
	setupFiles: ['<rootDir>/src/tests/index.ts'],
	setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
	testEnvironment: 'node',

	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
	moduleNameMapper: {
		// '^@App/(.*)$': '<rootDir>/src/$1',
		// '^lib/(.*)$': '<rootDir>/common/$1',

		'^@useCases/(.*)$': '<rootDir>/src/use-cases/$1',
		'^@tests/(.*)$': '<rootDir>/src/tests/$1',
		'^@domain/(.*)$': '<rootDir>/src/domain/$1',
		'^@messagesConsumers/(.*)$': '<rootDir>/src/messages-consumers/$1',
		'^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
	},
	resolver: undefined,
};
