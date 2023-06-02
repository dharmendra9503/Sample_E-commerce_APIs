const express = require('express');
const router = express.Router();
const { welcome, create, viewById, update, deleteById, list } = require('../controllers/product.controller');


router.get('/', welcome);                       //Welcome API

router.get('/list', list);                      //List all products
router.get('/:id/view', viewById);                 //Get any specific product (get product by id)
router.post('/create', create);                    //Insert new product
router.put('/:id/update', update);                 //Edit product (Edit product by id)
router.delete('/:id/delete', deleteById);          //Delete product (Delete Product by id)
// router.get('/list/:sku', searchBySku);               //In product list, search product using name or SKU
// router.get('/list/:name', searchByName);               //In product list, search product using name or SKU

module.exports = router;




// API: localhost:3030/api/list?page=?&limit=?
// API: localhost:3030/api/list?productName=?
// API: localhost:3030/api/list?productSku=?