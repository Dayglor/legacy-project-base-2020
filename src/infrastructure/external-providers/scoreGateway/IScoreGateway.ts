export interface IScoreQueryProvider {
	consult(data, tipo): Promise<any>;
	details(data): Promise<any>;
}
