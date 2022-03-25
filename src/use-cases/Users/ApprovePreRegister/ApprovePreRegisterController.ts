import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

// import { CreatePlanUseCase } from '@useCases/Plans/CreatePlanUseCase';

// import { SaveAccountConfiguration } from '../../AccountConfigurations/SaveAccountConfigurationUseCase';
// import { DetailsPreRegisterUseCase } from '../DetailsPreRegister/DetailsPreRegisterUseCase';
import { ApprovePreRegisterUseCase } from './ApprovePreRegisterUseCase';

@autoInjectable()
export class ApprovePreRegisterController {
	constructor(
		private readonly approvePreRegisterUseCase: ApprovePreRegisterUseCase // private readonly detailsPreRegisterUseCase: DetailsPreRegisterUseCase, // private readonly saveAccountConfiguration: SaveAccountConfiguration, // private readonly createPlanUseCase: CreatePlanUseCase
	) {}

	async handle(request: Request, response: Response): Promise<Response> {
		try {
			// const user = await this.detailsPreRegisterUseCase.execute({ userId: request.body.id });
			await this.approvePreRegisterUseCase.execute(request.body);
			// await this.saveAccountConfiguration.execute(request.body);
			// await this.createPlanUseCase.execute(request.body);

			return response.json({ success: true, message: 'Operação realizada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ success: false, message: error.message });
		}
	}
}
