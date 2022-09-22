const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveProducts(product) {


    try {
        const result = await db.query(
            `insert into productos ( CodProducto, Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,Usuario) 
            VALUES 
            ('${product.codProducto}', '${product.descripcion}', '${product.imagen}', ${product.stock}, 
            ${product.precio} ,  ${product.medStock} , '${product.fecAlta}' , '${product.usuario}' )`
        );


        let message = 'Error guardando los datos del producto';

        if (result.affectedRows) {
            message = 'Producto guardado correctamente';
        }

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}


async function getProducts() {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select CodProducto,Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,FecModificacion,Usuario from productos `
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, products: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getProductbyCode(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select CodProducto,Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,FecModificacion,Usuario from productos 
            where UPPER(CodProducto)=UPPER('${product.codProducto}')`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getProductByDescription(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select CodProducto,Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,FecModificacion,Usuario from productos 
            where Descripcion LIKE '%${product.descripcion}%'`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}


module.exports = {
    saveProducts,
    getProducts,
    getProductbyCode,
    getProductByDescription
}