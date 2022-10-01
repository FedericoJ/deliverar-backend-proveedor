const express = require('express');
const router = express.Router();
const products = require('../services/products');



router.post('/createProduct', async function(req, res, next) {
    try {
      res.json(await products.saveProducts(req.body));
    } catch (err) {
      console.error(`Error creando producto`, err.message);
      next(err);
    }
  });


  router.get('/getProductByCode', async function(req, res, next) {
    try {

      const result= await products.getProductbyCode(req.body)  
      
      res.status(result.code).json(result.product);

    } catch (err) {
      console.error(`Error obteniendo producto por código`, err.message);
      next(err);
    }
  });

  router.get('/getProductByDescription', async function(req, res, next) {
    try {

      const result= await products.getProductByDescription(req.body)  
      
      res.status(result.code).json(result.product);

    } catch (err) {
      console.error(`Error obteniendo producto por descripción`, err.message);
      next(err);
    }
  });

  router.get('/getProducts', async function(req, res, next) {
    try {

      const result= await products.getProducts();  
      
      res.status(result.code).json(result.products);

    } catch (err) {
      console.error(`Error obteniendo productos`, err.message);
      next(err);
    }
  });

  router.post('/updateProductByCode', async function(req, res, next) {
    try {
      res.json(await products.updateProductByCode(req.body));
    } catch (err) {
      console.error(`Error actualizando producto`, err.message);
      next(err);
    }
  });

  router.delete('/deleteProductByCode', async function(req, res, next) {
    try {
      res.json(await products.deleteProductByCode(req.body));
    } catch (err) {
      console.error(`Error eliminando producto`, err.message);
      next(err);
    }
  });

  


  module.exports = router;