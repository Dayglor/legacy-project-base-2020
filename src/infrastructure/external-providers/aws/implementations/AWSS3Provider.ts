import AWS from 'aws-sdk';

import { IAWSS3, IAWSS3UploadData } from '../IAWSS3Provider';

export class AWSS3Provider implements IAWSS3 {
	private S3: AWS.S3;
	private _CloudWatchLogs: AWS.CloudWatchLogs;
	public get CloudWatchLogs(): AWS.CloudWatchLogs {
		return this._CloudWatchLogs;
	}
	public set CloudWatchLogs(value: AWS.CloudWatchLogs) {
		this._CloudWatchLogs = value;
	}
	constructor() {
		AWS.config.update({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		});

		this.S3 = new AWS.S3();
		this.CloudWatchLogs = new AWS.CloudWatchLogs({ region: 'sa-east-1' });
	}
	async upload(data: IAWSS3UploadData): Promise<any> {
		return this.S3.upload(data).promise();
	}
}
