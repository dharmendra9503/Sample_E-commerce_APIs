const express = require('express');
const router = express.Router();
const { create, viewById, update, deleteById, list } = require('../controllers/category.controller');

router.get('/list', list);                         //List all category
router.get('/:id/view', viewById);                 //Get any specific category (get product by id)
router.post('/create', create);                    //Insert new category
router.put('/:id/update', update);                 //Edit category (Edit category by id)
router.delete('/:id/delete', deleteById);          //Delete caategory (Delete category by id)

module.exports = router;

//API: list category by name (query: categoryName=<name>)