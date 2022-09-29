const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveOrder(order) {

    var currentTime = new Date();

    try {
        const result = await db.query(
            `insert into pedidos (Usuario,Total,snAprobado,idFranquicia,Estado,FecAlta) 
            VALUES 
            (${order.usuario}, ${order.total},'N', ${order.idFranquicia},'CREADO','${currentTime}')`
        );

        let message = 'Error guardando los datos del pedido';

        if (result.affectedRows) {

            var idPedidoAnterior =result.insertId;

            order.products.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into detallepedido (idPedido, CodProducto, cantidad, FecAlta) 
                    VALUES 
                    (${idPedidoAnterior}, '${detail.CodProducto}', '${detail.cantidad}',
                    '${currentTime}')`
                );
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido guardar los ingredientes utilizados" };
                }
    
            });

            return { code: 201, message: message }

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


async function updateEstadoPedido(order){

    try {
        // Find the User 

        const result = await db.query(
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago from pedidos 
            where IdPedido=${order.id}`
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

        return { code: 201, orders: data };

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

        return { code: 201, orders: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}


module.exports = {
    saveOrder,
    getOrders,
    getOrderById,
    getOrderbyFranquicia
}