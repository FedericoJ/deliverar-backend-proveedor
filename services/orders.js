const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveOrder(order) {

    //FALTA DETALLE DE PEDIDO
    try {
        const result = await db.query(
            `insert into pedidos ( CodProducto, Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,Usuario) 
            VALUES 
            (${order.idPedido}', '${order.CodProducto}', '${order.Cantidad}', ${order.PrecioUnitario}, 
            '${order.fecAlta}' )`
        );


        let message = 'Error guardando los datos del pedido';

        if (result.affectedRows) {
            message = 'Pedido guardado correctamente';
        }

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}


async function getOrders() {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago `
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, orders: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getOrderById(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago from pedidos 
            where IdPedido=${order.id}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getOrderbyFranquicia(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago from pedidos 
            where IdFranquicia =${order.idFranquicia}`
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