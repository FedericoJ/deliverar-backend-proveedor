const express = require('express');
const router = express.Router();
const products = require('../services/products');



router.post('/createProduct', async function(req, res, next) {
    try {
      res.json(await products.guardarMultimedia(req.body));
    } catch (err) {
      console.error(`Error guardando los archivos multimedia del paso`, err.message);
      next(err);
    }
  });


  router.get('/getProductById', async function(req, res, next) {
    try {

      const result= await products.getMultimedia(req.query)  
      
      res.status(result.code).json(result.multimedia);

    } catch (err) {
      console.error(`Error obteniendo multimedia`, err.message);
      next(err);
    }
  });

  router.get('/getProducts', async function(req, res, next) {
    try {

      const result= await products.getTiposreceta(req.body);  
      
      res.status(result.code).json(result.multimedia);

    } catch (err) {
      console.error(`Error obteniendo los tipos de receta`, err.message);
      next(err);
    }
  });


  module.exports = router;