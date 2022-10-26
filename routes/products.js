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

  router.post('/createMultipleProducts', async function(req, res, next) {
    try {
      res.json(await products.saveMultipleProducts(req.body));
    } catch (err) {
      console.error(`Error creando productos`, err.message);
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

      const result= await products.getProducts(req.query);  
      
      res.status(result.code).json(result.products);

    } catch (err) {
      console.error(`Error obteniendo productos`, err.message);
      next(err);
    }
  });

  router.get('/getAllProducts', async function(req, res, next) {
    try {

      const result= await products.getAllProducts();  
      
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

  router.post('/deleteProductByCode', async function(req, res, next) {
    try {
      res.json(await products.deleteProductByCode(req.body));
    } catch (err) {
      console.error(`Error eliminando producto`, err.message);
      next(err);
    }
  });

  //Modulo de Ofertas

router.post('/createOffer', async function(req, res, next) {
    try {
      res.json(await products.saveOffers(req.body));
    } catch (err) {
      console.error(`Error creando oferta`, err.message);
      next(err);
    }
  });

  router.post('/updateOffer', async function(req, res, next) {
    try {
      res.json(await products.updateOfferByCode(req.body));
    } catch (err) {
      console.error(`Error creando producto`, err.message);
      next(err);
    }
  });

  router.post('/deleteOffer', async function(req, res, next) {
    try {
      res.json(await products.deleteOfferbyCode(req.body));
    } catch (err) {
      console.error(`Error creando producto`, err.message);
      next(err);
    }
  });

  router.get('/getOffer', async function(req, res, next) {
    try {

      const result= await products.getOffer(req.query);  
      
      res.status(result.code).json(result.products);

    } catch (err) {
      console.error(`Error obteniendo ofertas`, err.message);
      next(err);
    }
  });




  module.exports = router;