export class File {
	public fileType: number; // 1 - Comprovante, 2 - Nota Fiscal, 0 - Outros
	public name: string;
	public type: string;
	public size: number;
	public path: string;

	constructor(props: File) {
		Object.assign(this, props);
	}
}
