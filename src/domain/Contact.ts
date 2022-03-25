export class Contact {
	public id?: string;
	public contactTypeId: string;
	public reference?: number;
	public name: string;
	public contact: string;

	constructor(props: Contact) {
		Object.assign(this, props);
	}
}
