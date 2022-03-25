export class Address {
	public id?: string;
	public street: string;
	public number: number;
	public city: string;
	public complement?: string;
	public state: string;
	public neighborhood: string;
	public postalCode: string;
	public country: string;

	constructor(props: Address) {
		Object.assign(this, props);
	}
}
