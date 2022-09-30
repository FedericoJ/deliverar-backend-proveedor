const express = require('express');
const router = express.Router();
const order = require('../services/orders');



router.post('/createOrder', async function(req, res, next) {
    try {
      res.json(await order.saveOrder(req.body));
    } catch (err) {
      console.error(`Error creando la orden`, err.message);
      next(err);
    }
  });


  router.get('/getOrderById', async function(req, res, next) {
    try {

      const result= await order.getOrderById(req.query)  
      
      res.status(result.code).json(result.orders);

    } catch (err) {
      console.error(`Error obteniendo la orden`, err.message);
      next(err);
    }
  });

  router.get('/getOrderByFranquicia', async function(req, res, next) {
    try {

      const result= await order.getOrderbyFranquicia(req.query)  
      
      res.status(result.code).json(result.orders);

    } catch (err) {
      console.error(`Error obteniendo orden por franquicia`, err.message);
      next(err);
    }
  });

  router.get('/getOrders', async function(req, res, next) {
    try {

      const result= await order.getOrders();  
      
      res.status(result.code).json(result.orders);

    } catch (err) {
      console.error(`Error obteniendo ordenes`, err.message);
      next(err);
    }
  });


  module.exports = router;