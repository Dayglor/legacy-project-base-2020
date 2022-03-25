import { validate } from 'class-validator';
import crypto from 'crypto';
import { BaseEntity } from 'typeorm';

import { EnhancedError } from '@infrastructure/errors/EnhancedError';

import { Formatter } from './formatter';

export class Utils {
	static async forEachAsync(array: any, callback: any): Promise<void> {
		for (const [index] of array.entries()) {
			// eslint-disable-next-line no-await-in-loop
			await callback(array[index], index, array);
		}
	}

	static async forEachAsync2(array: any, callback: any): Promise<void> {
		const results = [];
		for (const [index] of array.entries()) {
			results.push(callback(array[index], index, array));
		}
		await Promise.all(results);
	}

	static dateToDbDate(date: any): Date {
		const d = date.split('/');
		return new Date(`${d[2]}-${d[1]}-${d[0]}T00:00:00`);
	}

	static validateCpf(cpf: any): boolean {
		// eslint-disable-next-line no-param-reassign
		cpf = cpf.replace(/[^\d]+/g, '');
		if (cpf === '') return false;
		// Elimina CPFs invalidos conhecidos
		if (
			cpf.length !== 11 ||
			cpf === '00000000000' ||
			cpf === '11111111111' ||
			cpf === '22222222222' ||
			cpf === '33333333333' ||
			cpf === '44444444444' ||
			cpf === '55555555555' ||
			cpf === '66666666666' ||
			cpf === '77777777777' ||
			cpf === '88888888888' ||
			cpf === '99999999999'
		) {
			return false;
		}
		// Valida 1o digito
		let i = 0;
		let rev = 0;
		let add = 0;
		for (i = 0; i < 9; i += 1) {
			// eslint-disable-next-line radix
			add += parseInt(cpf.charAt(i)) * (10 - i);
		}
		rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) {
			rev = 0;
		}
		// eslint-disable-next-line radix
		if (rev !== parseInt(cpf.charAt(9))) {
			return false;
		}
		// Valida 2o digito
		add = 0;
		for (i = 0; i < 10; i += 1) {
			// eslint-disable-next-line radix
			add += parseInt(cpf.charAt(i)) * (11 - i);
		}
		rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) {
			rev = 0;
		}
		// eslint-disable-next-line radix
		if (rev !== parseInt(cpf.charAt(10))) {
			return false;
		}
		return true;
	}

	static validateCnpj(cnpj: any): boolean {
		// Aceita receber o valor como string, número ou array com todos os dígitos
		const isString = typeof cnpj === 'string';
		const validTypes = isString || Number.isInteger(cnpj) || Array.isArray(cnpj);

		// Elimina valor em formato inválido
		if (!validTypes) return false;

		// Filtro inicial para entradas do tipo string
		if (isString) {
			// Limita ao máximo de 18 caracteres, para CNPJ formatado
			if (cnpj.length > 18) return false;

			// Teste Regex para veificar se é uma string apenas dígitos válida
			const digitsOnly = /^\d{14}$/.test(cnpj);
			// Teste Regex para verificar se é uma string formatada válida
			const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj);

			// Se o formato é válido, usa um truque para seguir o fluxo da validação
			if (!digitsOnly && !validFormat) {
				return false;
			}
		}

		// Guarda um array com todos os dígitos do valor
		const match = cnpj.toString().match(/\d/g);
		const numbers = Array.isArray(match) ? match.map(Number) : [];

		// Valida a quantidade de dígitos
		if (numbers.length !== 14) return false;

		// Elimina inválidos com todos os dígitos iguais
		const items = [...new Set(numbers)];
		if (items.length === 1) return false;

		// Cálculo validador
		const calc = (x) => {
			const slice = numbers.slice(0, x);
			let factor = x - 7;
			let sum = 0;

			// eslint-disable-next-line no-plusplus
			for (let i = x; i >= 1; i--) {
				const n = slice[x - i];
				// eslint-disable-next-line no-plusplus
				sum += n * factor--;
				if (factor < 2) factor = 9;
			}

			const result = 11 - (sum % 11);

			return result > 9 ? 0 : result;
		};

		// Separa os 2 últimos dígitos de verificadores
		const digits = numbers.slice(12);

		// Valida 1o. dígito verificador
		const digit0 = calc(12);
		if (digit0 !== digits[0]) return false;

		// Valida 2o. dígito verificador
		const digit1 = calc(13);
		return digit1 === digits[1];
	}

	static async validate(entity: BaseEntity): Promise<boolean> {
		const errors = await validate(entity);

		if (errors.length > 0) {
			throw new EnhancedError(
				'Validation error.',
				errors
					.map((e) => Object.values(e.constraints))
					.join()
					.split(',')
					.map((e) => `${entity.constructor.name}.${e}`)
			);
		}

		return true;
	}

	static encrypt(data: string): string {
		const algorithm = 'aes-256-cbc';
		const initVector = `${process.env.SALT}`.substr(5, 16);
		const Securitykey = `${process.env.SALT}`.substr(0, 32);
		const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
		let encryptedData = cipher.update(data, 'utf-8', 'hex');
		encryptedData += cipher.final('hex');

		return encryptedData;
	}

	static decrypt(data: string): string {
		const algorithm = 'aes-256-cbc';
		const initVector = `${process.env.SALT}`.substr(5, 16);
		const Securitykey = `${process.env.SALT}`.substr(0, 32);
		const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
		let decryptedData = decipher.update(data, 'hex', 'utf-8');
		decryptedData += decipher.final('utf8');

		return decryptedData;
	}

	static isset(accessor: any): boolean {
		try {
			return typeof accessor() !== 'undefined';
		} catch (e) {
			return false;
		}
	}

	static amountToReal(amount: string): string {
		try {
			const price = +amount / 100;
			return Formatter.Real(price);
			// return `R$ ${price.replace('.', ',')}`;
		} catch (e) {
			return '';
		}
	}
}
