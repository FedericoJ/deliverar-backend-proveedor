const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveOrder(order) {
    var currentTime = new Date();

    try {
        const result = await db.query(
            `insert into pedidos (FecAlta, IdFranquicia, SnFinalizado, DescripcionFranquicia, IdProveedor) 
            VALUES 
            (now(), ${order.idFranquicia},'N', '${order.DescripcionFranquicia}','${order.IdProveedor}')`
        );

        if (order.detail.length>0) {

            order.detail.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into detallepedido (idPedido, CodProducto, Cantidad, PrecioUnitario, FecAlta, IdProovedor) 
                    VALUES 
                    (${result.insertId}, '${detail.CodProducto}', '${detail.cantidad}','${detail.PrecioUnitario}',now(),'${detail.IdProveedor}')`
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
            `select P.IdPedido, P.FecAlta, P.FecModificacion, P.IdFranquicia, P.SnFinalizado, P.DescripcionFranquicia, IdProveedor,
            ifnull((select sum(preciounitario * cantidad) from detallepedido DP where DP.IdPedido=P.IdPedido),0) as Importe 
            from pedidos P
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

    var query= `select P.IdPedido, P.FecAlta, P.FecModificacion, P.IdFranquicia, P.SnFinalizado, P.DescripcionFranquicia, P.IdProveedor, 
        ifnull((select sum(preciounitario*cantidad) from detallepedido DP where DP.IdPedido=P.IdPedido),0) as Importe 
        from pedidos P
        WHERE IdFranquicia =${order.idFranquicia}`; 
    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        if (order.idpedido !== undefined){
            query = query + ` AND IdPedido=${order.idpedido}`;
        }

        if (order.vigente !== undefined){
            //Pedir que manden S o N
            query = query + ` AND SnFinalizado=${order.vigente}`;
        }

        const result = await db.query(
            query
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

async function getOrdersDetail(order) {

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
    getOrdersFinished,
    getOrdersDetail
}