
function openDatabase() {
	// return db instances
	const DB_NAME = 'currencies-db';
	const database = indexedDB.open(DB_NAME, 1);

	database.onupgradeneeded = function(event) {
		// listen to event response
		var upgradeDB = event.target.result;

		// create an objectStore for the database
		var objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}


function saveToDatabase(data) {
	// init databae
	const db = openDatabase();

	// on success add user
	db.onsuccess = (event) => {

		// log database opened
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(data.currencyId);

		// wait for users to arrive
		currency.onsuccess = (event) => {
			const dbData = event.target.result;
			const store = query.transaction("currencies", "readwrite").objectStore("currencies");

			if (!dbData) {
				// save data into currency object
				store.add(data.currencyId, data.currencySymbol);

			}else {
				// update data existing currency object
				store.put(data.currencyId, data.symbol);
			};
		}
	} 
}