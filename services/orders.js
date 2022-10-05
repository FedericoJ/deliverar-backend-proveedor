const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveOrder(order) {
    var currentTime = new Date();

    try {
        const result = await db.query(
            `insert into pedidos (FecAlta, IdFranquicia, SnFinalizado, DescripcionFranquicia, IdProovedor) 
            VALUES 
            (now(), ${order.idFranquicia},'N', '${order.DescripcionFranquicia}','${order.IdProovedor}')`
        );

        if (order.detail.length>0) {

            order.detail.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into detallepedido (idPedido, CodProducto, Cantidad, PrecioUnitario, FecAlta, IdProovedor) 
                    VALUES 
                    (${result.insertId}, '${detail.CodProducto}', '${detail.cantidad}','${detail.PrecioUnitario}',now(),'${detail.IdProovedor}')`
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
            `select IdPedido, IdFranquicia, DescripcionFranquicia, 
            ifnull((select sum(preciounitario*cantidad) from detallepedido DP where DP.IdPedido=P.IdPedido),0) as Importe, 
            right(cast(FecAlta as DATE),10) as FecAlta, SnFinalizado
            from pedidos P`
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
            `select IdPedido, FecAlta, FecModificacion, IdFranquicia, SnFinalizado, DescripcionFranquicia, IdProovedor from pedidos 
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
            `select IdPedido, FecAlta, FecModificacion, IdFranquicia, SnFinalizado, DescripcionFranquicia, IdProovedor from pedidos 
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