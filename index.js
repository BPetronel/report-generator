const {readFileSync, writeFileSync} = require('fs');

const {
	transformCSVToJSON,
	generateReportFromJSON,
	generateImportJSON
} = require('./generate-report');

// Nu trebuie sa contina Adresa, Balanta intermediara sau CNP
const csv = readFileSync('./Tranzactii_01-11-2023_17-01-01.csv').toString();

const transactionList = generateImportJSON(transformCSVToJSON(csv));

writeFileSync(
	'./transactions.json',
	JSON.stringify(transactionList, undefined, '	')
);

const {transactions, incomes} = generateReportFromJSON(transformCSVToJSON(csv));
transactions.reverse().forEach(element => console.log(element));
console.log('\n');
incomes.reverse().forEach(element => console.log(element));
