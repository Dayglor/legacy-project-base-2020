export class Document {
	public documentTypeId: string;
	public document: string;
	public fileName: string;
	public mimetype: string;
	public size: string;
	public url: string;

	constructor(props: Document) {
		Object.assign(this, props);
	}
}
