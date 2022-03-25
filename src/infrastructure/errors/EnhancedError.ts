export class EnhancedError extends Error {
	constructor(message: string, private readonly data: any) {
		super(message);
	}
}
