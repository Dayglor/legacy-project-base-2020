/* eslint-disable camelcase */
import { Index, Entity, PrimaryColumn, Column } from 'typeorm';

import { DatabaseEntity } from './DatabaseEntity';

@Entity({ name: 'webhooks' })
// @Unique('UQ_email', ['email'])
export class Webhooks extends DatabaseEntity {
	@PrimaryColumn()
	id: string;

	@Index()
	@Column()
	gateway: string; // zspay - pagseguro

	@Index()
	@Column({ nullable: true })
	email: string; // email da pagsguro para poder visualizar a notificação

	@Index()
	@Column()
	object_type: string; // sale - signature (recorrencia do sistema)

	@Index()
	@Column()
	object_id: string; // id do pagamento ou do usuario que pagou a recorrência.

	@Column('longtext')
	payload: string;
}
