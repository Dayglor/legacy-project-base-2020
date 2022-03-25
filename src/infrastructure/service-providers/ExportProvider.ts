import { container } from 'tsyringe';

import { Excel } from '@infrastructure/export/excel';
import { ExportXLS } from '@infrastructure/export/ExportXLS';

export class ExportProvider {
	async register(): Promise<void> {
		container.register('Excel', { useValue: new Excel() });
		container.register('ExportXLS', { useValue: container.resolve(ExportXLS) });
	}
}
