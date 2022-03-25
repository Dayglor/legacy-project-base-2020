export enum TipoEstabelecimento {
	PF = 1,
	PJ = 2,
}

interface IEndereco {
	logradouro: string;
	numero: number;
	cidade: string;
	estado: string;
	cep: string;
}

export interface IZspayECDTO {
	tipoEstabelecimentoId: TipoEstabelecimento;

	email: string;
	endereco: IEndereco;

	// PF
	nome?: string;
	celular?: string;
	dataNascimento?: Date;
	cpf?: string;

	// PJ
	cnpj?: string;
	razaoSocial?: string;
	nomeFantasia?: string;
	telefone?: string;

	logo?: any;
	documentos?: [];
	documentosAtividade?: [];
	documentosResidencia?: [];
}
