const ExcelStyles = {
	headerDark: {
		fill: {
			fgColor: {
				rgb: '036596',
			},
		},
		font: {
			color: {
				rgb: 'ECA42D',
			},
			sz: 14,
			bold: true,
		},
		alignment: {
			horizontal: 'center',
		},
	},
	valorNegativo: {
		font: {
			color: {
				rgb: 'FF5440',
			},
		},
	},
	footer: {
		fill: {
			fgColor: {
				rgb: '036596',
			},
		},
		font: {
			color: {
				rgb: 'FFFFFF',
			},
			sz: 14,
			bold: true,
		},
		alignment: {
			horizontal: 'center',
		},
	},
	money: {
		numFmt: 'R$ #,##0.00_);[Red](R$ #,##0.00)',
	},
};

export default ExcelStyles;
