const MONTHS = {
	ianuarie: 1,
	februarie: 2,
	martie: 3,
	aprilie: 4,
	mai: 5,
	iunie: 6,
	iulie: 7,
	august: 8,
	septembrie: 9,
	octombrie: 10,
	noiembrie: 11,
	decembrie: 12
};

const INTERNAL = [
	'Constituire depozit',
	'Lichidare depozit',
	'Incasare din portofel electronic',
	"Alimentare Card Credit Home'Bank",
	'Taxe si comisioane'
];

const TERMINAL = [
	'Cumparare POS - stornare',
	'Incasare via card',
	'Cumparare POS',
	'Cumparare POS corectie',
	'Retragere numerar',
	'Retragere numerar fara card',
	'Depunere numerar',
	'Reglare operatiune'
];
const BENEFICIARY = ["Transfer Home'Bank", 'Plata online', 'Plata ATM'];
const ORDONATOR = ['Incasare'];

const IGNORED = ['Tranzactie Round Up'];

/* Transaction types */
const KNOWN_TRANSACTION_TYPES = [
	...INTERNAL,
	...TERMINAL,
	...BENEFICIARY,
	...ORDONATOR,
	...IGNORED
];

module.exports = {
	MONTHS,
	KNOWN_TRANSACTION_TYPES,
	INTERNAL,
	TERMINAL,
	BENEFICIARY,
	ORDONATOR,
	IGNORED
};
