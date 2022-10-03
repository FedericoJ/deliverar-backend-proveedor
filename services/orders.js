const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveOrder(order) {
    var currentTime = new Date();

    try {
        const result = await db.query(
            `insert into pedidos (Usuario,Total,snAprobado,idFranquicia,Estado,FecAlta) 
            VALUES 
            ('${order.usuario}', ${order.total},'N', ${order.idFranquicia},'CREADO',now())`
        );

        if (order.detail.length>0) {

            order.detail.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into detallepedido (idPedido, CodProducto, cantidad, FecAlta) 
                    VALUES 
                    (${result.insertId}, '${detail.CodProducto}', '${detail.cantidad}',now())`
                );
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido guardar los ingredientes utilizados" };
                }
    
            });

        }

        let message = "Pedido creado correctamente";

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
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago, Estado 
            from pedidos`
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
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago, Estado from pedidos 
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
            `select IdPedido, Usuario, Total, SnAprobado, fecAlta, FecModificacion, IdFranquicia,SnPago, Estado from pedidos 
            where IdFranquicia =${order.idFranquicia}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, orders: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getOrdersOnProgress(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select count(*) as Cantidad from pedidos 
            where IdFranquicia =${order.idFranquicia} and SnFinalizado='N'`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, orders: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getOrdersFinished(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select count(*) as Cantidad from pedidos 
            where IdFranquicia =${order.idFranquicia} and SnFinalizado='S'`
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
    getOrderbyFranquicia,
    getOrdersOnProgress,
    getOrdersFinished
}