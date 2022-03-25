import ExcelJS from 'exceljs';

const formats = {
	money: '_-R$ * #,##0.00_-;-R$ * #,##0.00_-;_-@_-',
	datetime: 'DD/MM/YYYY hh:mm:ss',
	date: 'DD/MM/YYYY',
};

export class Excel {
	async buildExport({ name, specification, data }: any): Promise<any> {
		try {
			const filename = `./tmp/${new Date().getTime()}.xlsx`;
			const options = {
				filename,
				useStyles: true,
				useSharedStrings: true,
			};
			const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);

			const sheet = workbook.addWorksheet(name);

			sheet.columns = Object.keys(specification).map((id) => {
				const c = specification[id];
				const format = formats[c.format];
				return { header: c.displayName, key: id, width: c.width / 10, style: { numFmt: format } };
			});

			const headersRow = sheet.getRow(1);
			headersRow.font = {
				size: 16,
				bold: true,
			};
			headersRow.alignment = {
				horizontal: 'center',
			};

			data.forEach((d: any) => {
				sheet.addRow(d).commit();
			});

			sheet.commit();

			await workbook.commit();

			return filename;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
