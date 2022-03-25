import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 } from 'uuid';

export class DatabaseEntity extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	modified: Date;

	@DeleteDateColumn()
	removed: Date;

	constructor(id?: string) {
		super();
		this.id = id;

		if (!id) {
			this.id = v4().replace(/[^a-z0-9]/gi, '');
		}
	}
}
