const { DB } = require('../config/status');
const util = require('util');
const mysql = require('mysql2');
const Sequelize = require('sequelize');


//Used for Row Query
/*
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

	// This is used to transform a callback-based function into a function that returns a promise.

	// --> dbConnection is an object that likely represents a database connection or client.
	// --> query is a method or function provided by the dbConnection object that is used to send a database query and receive the result.

	// --> util.promisify is a utility function provided by the util module that converts a callback-based function into a function that returns a promise. It takes a callback-based function as an argument and returns a new function that can be used with promises.


	// This is important because if the callback is not wrapped in a promise, the caller will not be able to handle the error.

dbConnection.query = util.promisify(dbConnection.query);
*/




//Used for npm sequelize
const dbConnection = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
	dialect: DB.DIALECT,
	host: DB.HOST
});


//Create Product table
const Product = dbConnection.define('product', {
	id: {
		type: Sequelize.DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	category_id: {
		type: Sequelize.DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'category',
			key: 'id'
		}
	},
	sku: {
		type: Sequelize.DataTypes.INTEGER,
		allowNull: false
	},
	name: {
		type: Sequelize.DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.DataTypes.STRING
	},
	status: {
		type: Sequelize.DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 1
	}
});


//Create Categories table
const Categories = dbConnection.define('categories', {
	id: {
		type: Sequelize.DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: Sequelize.DataTypes.STRING,
		allowNull: false
	},
	status: {
		type: Sequelize.DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 1
	}
});


Product.sync( /* { alter: true } */ ).then((data) => {
	// return Product.create({
	// 	sku: 22,
	// 	category_id: 2,
	// 	name: "Hindalco",
	// 	description: "Steel company"
	// })
	// console.log("Product Table and model synced sucessfully");
}).catch((err) => {
	console.log("Error syncing the table and model");
});

Categories.sync( /* { alter: true } */ ).then((data) => {
	// return Categories.create({
	// 	name: "Steel Corporation"
	// })
	console.log("Categories Table and model synced sucessfully");
}).catch((err) => {
	console.log("Error syncing the table and model");
});


dbConnection.authenticate().then(() => {
	console.log('Connected to Database');
}).catch((error) => {
	throw error;
})


module.exports = { dbConnection, Product, Categories };