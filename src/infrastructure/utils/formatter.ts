import CurrencyFormatter from 'currency-formatter';

const Formatter = {
	// nl2br: (str: string, is_xhtml: any) => {
	// 	// http://kevin.vanzonneveld.net
	// 	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// 	// +   improved by: Philip Peterson
	// 	// +   improved by: Onno Marsman
	// 	// +   improved by: Atli Þór
	// 	// +   bugfixed by: Onno Marsman
	// 	// +      input by: Brett Zamir (http://brett-zamir.me)
	// 	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// 	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// 	// +   improved by: Maximusya
	// 	// *     example 1: nl2br('Kevin\nvan\nZonneveld');
	// 	// *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
	// 	// *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
	// 	// *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
	// 	// *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
	// 	// *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
	// 	const breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

	// 	return `${str}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
	// },
	// Cpf: (v: string) => {
	// 	if (!v) return '';

	// 	return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	// },
	// Cnpj: (v: string) => {
	// 	if (!v) return '';

	// 	return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
	// },
	// Telefone: (v: any) => {
	// 	if (!v) return '';

	// 	return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	// },
	// Celular: (v: any) => {
	// 	if (!v) return '';
	// 	return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
	// },
	Real: (value: any, currency?: boolean): Promise<string> => {
		value = +value;

		const money = CurrencyFormatter.format(value, {
			code: 'BRL',
			format: {
				pos: '%s %v', // %s is the symbol and %v is the value
				neg: '%s -%v',
				zero: '%s %v',
			},
		});

		money.replace('R$', 'R$ ');

		if (currency === false) {
			return money.replace(/\s/g, '').replace('/ /g', ' ').replace('R$', '');
		}

		return money;
	},
	// Cartao: (v: string) => {
	// 	return v.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
	// },
	// Valor: (number: any, decimals: any, dec_point: any, thousands_sep: any) => {
	// 	var n = number,
	// 		prec = decimals;
	// 	n = !isFinite(+n) ? 0 : +n;
	// 	prec = !isFinite(+prec) ? 0 : Math.abs(prec);
	// 	var sep = typeof thousands_sep == 'undefined' ? ',' : thousands_sep;
	// 	var dec = typeof dec_point == 'undefined' ? '.' : dec_point;

	// 	var s = prec > 0 ? n.toFixed(prec) : Math.round(n).toFixed(prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

	// 	var abs = Math.abs(n).toFixed(prec);
	// 	var _, i;

	// 	if (+abs >= 1000) {
	// 		_ = abs.split(/\D/);
	// 		i = _[0].length % 3 || 3;

	// 		_[0] = s.slice(0, i + +(n < 0)) + _[0].slice(i).replace(/(\d{3})/g, sep + '$1');

	// 		s = _.join(dec);
	// 	} else {
	// 		s = s.replace('.', dec);
	// 	}

	// 	return s;
	// },
	// Pluralize: (nome: any, quantidade: number) => (quantidade > 1 ? `${nome}s` : nome),
	// DateToDbDate: (date: any) => {
	// 	const d = date.split('/');
	// 	const dia = d[0] || '';
	// 	const mes = d[1] || '';
	// 	const ano = d[2] || '';
	// 	return `${ano}-${mes}-${dia}`;
	// },
	// DbDateToDate: (date: any) => {
	// 	if (date instanceof Date) {
	// 		date = date.toISOString().split('T')[0];
	// 	} else {
	// 		date = `${date}`.split('T')[0];
	// 	}

	// 	const d = date.split('-');
	// 	const dia = d[2] || '';
	// 	const mes = d[1] || '';
	// 	const ano = d[0] || '';
	// 	return `${dia}/${mes}/${ano}`;
	// }
};

export default Formatter;
