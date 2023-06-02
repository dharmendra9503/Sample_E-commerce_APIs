const { DB } = require('../config/status');
const util = require('util');
const mysql = require('mysql2');


const dbConnection = mysql.createConnection({
	host: DB.HOST,
	user: DB.USERNAME,
	password: DB.PASSWORD,
	database: DB.NAME,
	port: DB.PORT
});

dbConnection.connect(error => {
	if (error) {
		throw error;
	}
	else {
		console.log('Connected to Database');
	}
});

/*
	This is used to transform a callback-based function into a function that returns a promise.

	--> dbConnection is an object that likely represents a database connection or client.
	--> query is a method or function provided by the dbConnection object that is used to send a database query and receive the result.

	--> util.promisify is a utility function provided by the util module that converts a callback-based function into a function that returns a promise. It takes a callback-based function as an argument and returns a new function that can be used with promises.


	This is important because if the callback is not wrapped in a promise, the caller will not be able to handle the error.
*/
dbConnection.query = util.promisify(dbConnection.query);

module.exports = { dbConnection };
