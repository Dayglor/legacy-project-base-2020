export interface IAWSS3UploadData {
	Bucket: string;
	Body: any;
	Key: string;
	ContentType: string;
	ACL?: string;
}

export interface IAWSS3 {
	upload(data: IAWSS3UploadData): Promise<any>;
}

// {
// 	Bucket: 'z-systems-bucket',
// 	Body: file, // ,
// 	Key: `files/estabelecimentos/logos/${Date.now()}_${logo.name}`,
// 	ContentType: logo.type,
// 	ACL: 'public-read',
// }
