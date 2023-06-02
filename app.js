const express = require('express');
// const path = require('path');
const productRoute = require('./routes/product.route');
const categoryRoute = require('./routes/category.route');
const app = express();


app.use(express.json());


app.use('/api', productRoute);
app.use('/api/category', categoryRoute);

// if trying to access incorrect route
app.use((req, res, next) => {
	res.status(404).send({ status: false });
});

global.dirname = __dirname;
// console.log("Hello: "+global.dirname);

module.exports = app;