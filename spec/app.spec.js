/*var express = require("express");
var app = express();*/
var request = require("request");


describe('Pruebas', function () {
  it("getProducts", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/products/getProducts?cuit=0"
    console.log('Obtener productos por cuit=0 -> http://proveedores-back.deliver.ar/products/getProducts?cuit=0')
    request.get(base_url, function (error, response, body) {
      expect(response.statusCode).toBe(201);
      done();
    });
 
  });
 
  it("getOrders", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/orders/getOrders?cuit=0"
    console.log('Obtener ordenes por cuit=0 -> http://proveedores-back.deliver.ar/orders/getOrders?cuit=0')
    request.get(base_url, function (error, response, body) {
      expect(response.statusCode).toBe(201);
      done();
    });
 
  });
 
  it("getOrdersOnProgress", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/orders/getOrdersOnProgress?cuit=0"
    console.log('Obtener ordenes en progreso por cuit=0 -> http://proveedores-back.deliver.ar/orders/getOrdersOnProgress?cuit=0')
    request.get(base_url, function (error, response, body) {
      expect(response.statusCode).toBe(201);
      done();
    });
 
  });
 
  it("getOrdersFinished", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/orders/getOrdersFinished?cuit=0"
    console.log('Obtener ordenes finalizadas por cuit=0 -> http://proveedores-back.deliver.ar/orders/getOrdersFinished?cuit=0')
    request.get(base_url, function (error, response, body) {
      expect(response.statusCode).toBe(201);
      done();
    });
 
  });

  it("createProduct", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/products/createProduct"
    console.log("Crear producto");
    request.post(base_url, { form: { codProducto: 'PR', descripcion: 'PRUEBA',stock:10,precio:100,cuit:0 } }, function (error, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    });

  });

  it("deleteProduct", function (done) {
    var base_url = "http://proveedores-back.deliver.ar/products/deleteProductByCode"
    console.log("Eliminar producto");
    request.post(base_url, { form: { codProducto: 'PR', cuit:0 } }, function (error, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    });

  });

});
