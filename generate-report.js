const {getCategory} = require('./categorize');
const {MONTHS, KNOWN_TRANSACTION_TYPES, INTERNAL, TERMINAL, BENEFICIARY, ORDONATOR, IGNORED} = require('./constants');

const parseFloatLocale = number => {
	const localeNumber = number.replace('.', '').replace(',', '.');
	return Number.parseFloat(localeNumber) || undefined;
};

function CSVToArray(CSV_string, delimiter = ',') {
	const delimiters = `(\\${delimiter}|\\r?\\n|\\r|^)`;
	const quotedFields = '(?:"([^"]*(?:""[^"]*)*)"|';
	const standardFields = `([^"\\${delimiter}\\r\\n]*))`;
	// regular expression to parse the CSV values.
	const pattern = new RegExp(`${delimiters}${quotedFields}${standardFields}`, 'gi');
	// array to hold our data. First row is column headers.
	// array to hold our individual pattern matching groups:
	const rows = [[]];
	// false if we don't find any matches
	let matches = false;
	// Loop until we no longer find a regular expression match
	while ((matches = pattern.exec(CSV_string))) {
		// Get the matched delimiter
		const matched_delimiter = matches[1];
		// Check if the delimiter has a length (and is not the start of string)
		// and if it matches field delimiter. If not, it is a row delimiter.
		if (matched_delimiter.length > 0 && matched_delimiter !== delimiter) {
			// Since this is a new row of data, add an empty row to the array.
			rows.push([]);
		}
		let matched_value;
		// Once we have eliminated the delimiter, check to see
		// what kind of value was captured (quoted or unquoted):
		if (matches[2]) {
			// found quoted value. unescape any double quotes.
			matched_value = matches[2].replace(new RegExp('""', 'g'), '"');
		} else {
			// found a non-quoted value
			const [, , , match] = matches;
			matched_value = match;
		}
		// Now that we have our value string, let's add
		// it to the data array.
		rows[rows.length - 1].push(matched_value);
	}
	// Return the parsed data Array
	return rows;
}

function removeRedundantColumns(array) {
	return array
		.map(row => {
			const [date, _, __, transactionDetails, ___, debit, credit] = row;
			return [date, transactionDetails, debit, credit];
		})
		// remove useless rows
		.filter(([firstColumn]) => !firstColumn.includes('Titular cont: '))
		.filter((row, index, rows) => {
			// the actual header
			if (index === 0) {
				return false;
			}
			// remove any occurrence of the header
			const header = rows[0].join('');
			if (header === row.join('')) {
				return false;
			}
			return !!row.join('');
		});

}

function transformCSVToJSON(csv) {
	const rows = removeRedundantColumns(CSVToArray(csv));
	return rows.reduce((finalData, currentRow) => {
		const [date, transactionDetails, debit, credit] = currentRow;
		if (date) {
			return [
				...finalData,
				{
					date,
					type: transactionDetails,
					debit: parseFloatLocale(debit),
					credit: parseFloatLocale(credit),
					other: []
				}
			];
		} else {
			finalData[finalData.length - 1].other = [...finalData[finalData.length - 1].other, transactionDetails];
			return finalData;
		}
	}, []);
}

function isTransactionBetweenOwnedAccounts(target) {
	return target === 'Boicu Claudiu- Petronel';
}
function getTarget(type, details) {
	if (!KNOWN_TRANSACTION_TYPES.includes(type)) {
		throw new TypeError(`New transaction type was added: ${type}!`);
	}

	const isIgnored = IGNORED.includes(type);
	if (!isIgnored) {
		const hasTarget = [...TERMINAL, ...BENEFICIARY, ...ORDONATOR].includes(type);
		const detailsString = details.join('\n');
		if (hasTarget) {
			const regex = /(?:Terminal: |Beneficiar: |Ordonator: )(.*)/g;
			const potentialTarget = regex.exec(detailsString);
			if (potentialTarget) {
				return potentialTarget[1];
			} else {
				const regex = /Detalii: (.*)/g;
				return regex.exec(detailsString)[1];
			}
		}
		const isInternal = INTERNAL.includes(type);
		if (isInternal) {
			return type;
		}
	}
	return '';
}

function getFormattedRow(date, value, target, category) {
	const [day, monthName, year] = date.split(' ');
	const formattedDate = `${MONTHS[monthName]}/${day}/${year}`;
	const formattedValue = value.toFixed(2).toString().padStart(9, ' ');
	const formatterTarget = target.padEnd(50, ' ');
	return `${formattedDate}	${formattedValue}	${formatterTarget}	${category}`;
}

function generateReportFromJSON(rows) {
	const transactions = [];
	const incomes = [];
	rows.forEach(({date, type, debit, credit, other}) => {
		const target = getTarget(type, other);
		if (!target && !IGNORED.includes(type)) {
			throw new TypeError('Target or Type is missing');
		}
		if (target && !isTransactionBetweenOwnedAccounts(target)) {
			const category = getCategory(target);
			// income
			if (credit && target) {
				incomes.push(getFormattedRow(date, credit, target, category));
			}

			// outcome
			if (debit && target) {
				transactions.push(getFormattedRow(date, debit, target, category));
			}
		}
	});

	return {
		transactions,
		incomes
	};
}

function generateImportJSON(rows) {
	return rows
		.map(({date, type, debit, credit, other}) => {
			const target = getTarget(type, other);
			if (!target && !IGNORED.includes(type)) {
				throw new TypeError('Target or Type is missing');
			}
			if (target && !isTransactionBetweenOwnedAccounts(target)) {
				const category = getCategory(target);
				const [day, monthName, year] = date.split(' ');

				return {
					date: new Date(year, MONTHS[monthName] - 1, day).toISOString(),
					entity: target,
					total: debit || credit,
					category,
					paymentMethod: 'CARD',
					transactionType: debit ? 'EXPENSE' : 'INCOME'
				};
			}
		})
		.filter(Boolean);
}

module.exports = {
	CSVToArray,
	removeRedundantColumns,
	transformCSVToJSON,
	generateReportFromJSON,
	generateImportJSON
};
