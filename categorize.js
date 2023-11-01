const {INTERNAL} = require('./constants');
/* Stores in different categories */
const FOOD = [
	'AUCHAN',
	'COLUMBUS OPERATIONAL',
	'KAUFLAND',
	'CARREFOUR',
	'STRONGMNDCORP.SRL',
	'ARTIMA',
	'LIDL',
	'PENNY',
	'PROFI',
	'CAMARA LUI BACIU',
	'STAR CATALIN',
	'MEAT CONCEPT STORE',
	'MCS STORE',
	'GEMI SERCOM',
	'MCS STORE DEP',
	'GLOVOAPPRO',
	'MEGAIMAGE',
	'LA DOI PASI',
	'ANCORA  RO'
];
const FOOD_CITY = [
	`ANTS'N BEES`,
	'SALAD BOX',
	'CHEF GALERIE',
	'BISTRO FELIX',
	'VO CHEF',
	'TRIBECA',
	'LA CUPOLA',
	'SWEET BLANCA',
	'Veranda',
	'IRA SUSHI',
	'SUSHI MASTER',
	'LA CASTEL',
	'sushimaster.ro',
	'BUENA VISTA',
	'CHEZ LES AMIS',
	'TOUJOURS',
	'RETRO CAFE',
	'ECADA',
	'DOREMI',
	'MEGA PIADINA'
];
const JUNK_FOOD = [
	'TAJ MAHAL',
	'VIVO',
	'IVVI PROJECTS',
	'KFC',
	'BY LI',
	'NOODLE PACK',
	'PIZZA HUT',
	'CHINESE EXPRESS',
	'YAMMY LI',
	'CORSINI BOTTEGA',
	'SHANGHAI FOODCOURT',
	'MESOPOTAMIA DEP',
	'CORSINI CIAMBELLA',
	'FRANKLY',
	'ONUR FOOD',
	'FAST FOOD CLASS',
	'FAST FOOS CLASS',
	'PIZZERIA ALILA',
	'ALILA SRL',
	'TAZZ.RO',
	'CALIFORNIA FRESH',
	'GANDALF CATERING'
];
const UTILITIES = [
	'GOOGLE STORAGE',
	'GOOGLE *SERVICES',
	'EPS DISTRIBUTION GRUP',
	'E.ON ENERGIE',
	'EON GAZ FURNIZARE',
	'RCS AND RDS',
	'WWW.EON.RO/MYLINE',
	'salubris',
	'WWW.ORANGE.RO/YOXO'
];
const HEALTH_MEDICAL = [
	'NN ASIGURARI DE VIATA SA',
	'NN PENSIA FACULTATIVA',
	'ROPHARMA',
	'PAYU*NNDIRECT.RO',
	'TEHNIS MKS',
	'CATENA',
	'ESTER FARM SRL',
	'SC COLOR DENT SRL',
	'D.D.I. RADIOLOGIE SRL',
	'SENSIBLU',
	'PROFESSIONAL DENTIST',
	'SCARLAT GENERAL',
	'EDENTA RADIOLOGIE',
	'FARMACIA DONA',
	'Farmacie Iasi',
	'DR MAX',
	'STIL TEHN',
	'MAGISTRA PLUS',
	'ARCADIA POLICLINIC',
	'DAVILLA FARM',
	'HELP NET'
];
const COFFEE = [
	'CAFENEAUA NOASTRA',
	'LA FOLIE FOOD COURT',
	'LA FOLIE',
	'NOIR PALAS',
	"SENTI'S CAFE",
	'MATALA BISTRO',
	'NOIR Piata Unirii',
	'NOIR UMF'
];
const HOME = [
	'DEDEMAN',
	'ARABESQUE',
	'LEROY MERLIN',
	'UNIVERSAL MOTO - VELO',
	'MOTO-VELO-SPORT',
	'PEPCO',
	'PayU*eMAG.ro',
	'ALTEX',
	'KITCHEN SHOP',
	'JYSK',
	'OMNICLEAN',
	'IKEA'
];
const PAYCHECK = ['AREZZO SKY', 'ASCONT INTERNATIONAL', 'CEGEKA ROMANIA SRL'];
const HOBBY = [
	'WWW.STEAMPOWERED.COM',
	'STEAMGAMES.COM',
	'STEAM PURCHASE',
	'LEX HOBBY',
	'MOTO VELO SPORT'
];
const PERSONAL = [];
const TRANSPORTATION = ['COMPANIA TRANSPORT PUBL', 'BOLT.EU', 'UBER.COM'];
const BOOKS = [
	'EP*burda.ro',
	'ELEFANT.RO',
	'PIM SRL',
	'carturesti.ro',
	'CARTURESTI'
];
const INVESTMENTS = ['Tradeville S.A'];
const CLOTHES = ['Deichmann', 'WAIKIKI', 'HERVIS', 'ROUMASPORT'];
const CAR = ['DOLY SRL'];
const GAS = ['MOL', 'ROMPETROL'];

const CATEGORIES = {
	Food: FOOD,
	JunkFood: JUNK_FOOD,
	Utilities: UTILITIES,
	'Food - City': FOOD_CITY,
	Coffee: COFFEE,
	Home: HOME,
	'Health/Medical': HEALTH_MEDICAL,
	PayCheck: PAYCHECK,
	Personal: PERSONAL,
	Transportation: TRANSPORTATION,
	Books: BOOKS,
	Investment: INVESTMENTS,
	Clothes: CLOTHES,
	Car: CAR,
	Gas: GAS,
	Hobby: HOBBY
};

function getCategory(target) {
	let transactionCategory;
	Object.entries(CATEGORIES).forEach(([category, stores]) => {
		const isStoreInCategory = stores.some(store =>
			target.toUpperCase().includes(store.toUpperCase())
		);
		if (isStoreInCategory) {
			transactionCategory = category;
		}
	});

	if (!transactionCategory && INTERNAL.includes(target)) {
		switch (target) {
			case "Alimentare Card Credit Home'Bank":
				return 'Home';
			case 'Incasare din portofel electronic':
				return 'Interest';
			case 'Constituire depozit':
			case 'Lichidare depozit':
				return 'Savings';
			case 'Taxe si comisioane':
				return 'Taxes';
			default:
				throw new TypeError('Category is unknown!');
		}
	}
	return transactionCategory;
}
module.exports = {
	getCategory
};
