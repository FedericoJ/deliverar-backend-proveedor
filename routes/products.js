const express = require('express');
const router = express.Router();
const products = require('../services/products');



router.post('/createProduct', async function(req, res, next) {
    try {
      res.json(await products.saveProducts(req.body));
    } catch (err) {
      console.error(`Error guardando los archivos multimedia del paso`, err.message);
      next(err);
    }
  });


  router.get('/getProductByCode', async function(req, res, next) {
    try {

      const result= await products.getProductbyCode(req.query)  
      
      res.status(result.code).json(result.product);

    } catch (err) {
      console.error(`Error obteniendo multimedia`, err.message);
      next(err);
    }
  });

  router.get('/getProducts', async function(req, res, next) {
    try {

      const result= await products.getProducts();  
      
      res.status(result.code).json(result.products);

    } catch (err) {
      console.error(`Error obteniendo los tipos de receta`, err.message);
      next(err);
    }
  });


  module.exports = router;