import { createConnection, Connection } from 'typeorm';

export class MysqlConnectionFactory {
	static async make(options: any): Promise<Connection> {
		const connection = await createConnection(options);

		return connection;
	}
}
