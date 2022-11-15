const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const axios = require('axios');




async function getOrders(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select IdPedido, IdFranquicia, DescripcionFranquicia, 
            ifnull((select sum(preciounitario*cantidad) from detallepedido DP where DP.IdPedido=P.IdPedido),0) as Importe, 
            right(cast(FecAlta as DATE),10) as FecAlta, SnFinalizado
            from pedidos P
            where IdProveedor =${order.cuit}`
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

async function getOrdersOnProgress(order) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select count(*) as Cantidad from pedidos 
            where IdProveedor =${order.cuit} and SnFinalizado='N'`
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
            where IdProveedor =${order.cuit} and SnFinalizado='S'`
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
            `
            select (select Descripcion from productos P where P.CodProducto=DP.CodProducto and P.IdProveedor=DP.IdProveedor) as Descripcion,
            CodProducto as CodigoProducto,
            Cantidad,
            cast(PrecioUnitario as decimal(19,2)) as Importe
            from detallepedido DP where idpedido=${order.idPedido}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, orders: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

//Para la Franquicia 

async function saveOrder(order) {
    var currentTime = new Date();
    console.log("pase por aca");

    try {
        const result = await db.query(
            `insert into pedidos (FecAlta, IdFranquicia, SnFinalizado, DescripcionFranquicia, IdProveedor) 
            VALUES 
            (now(), ${order.idFranquicia},'N', '${order.DescripcionFranquicia}','${order.IdProovedor}')`
        );

        if (order.detail.length>0) {

            order.detail.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into detallepedido (idPedido, CodProducto, Cantidad, PrecioUnitario, FecAlta, IdProveedor) 
                    VALUES 
                    (${result.insertId}, '${detail.CodProducto}', '${detail.cantidad}',(select precio*(ifnull((select 1-(porcentaje/100) from ofertas O where O.CodProducto=P.CodProducto and O.cuit=P.IdProveedor and fecHasta > now()),1)) PrecioDesc
                    from productos P where P.CodProducto='${detail.CodProducto}' and P.IdProveedor='${order.IdProovedor}'),now(),'${order.IdProovedor}')`
                );
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido guardar los ingredientes utilizados" };
                }
    
            });

        }
        const body={"_id":order._id.$oid ,"idPedido": result.insertId,"tipo":"nuevo-pedido"};

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("id pedido enviado " + result.insertId + "id pedido recibido " + order._id.$oid);
            })
            .catch(error =>{
                console.log(error);
            })

        let message = "Pedido creado correctamente";

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}

async function updateOrderStatus(order) {

    try {

        if (order.detail.length>0) {

            order.detail.forEach(async detail => {      
    
                const result1 = await db.query(
                    `update pedidos
                    set SnFinalizado='S'
                    where IdPedido=${detail.idPedido}`
                );
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido finalizar los pedidos" };
                }
    
            });
        }

        let message = "Pedido finalizado correctamente";

        return { code: 201, message: message }

    } catch (e) {

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


async function getOrderDetailbyFranquicia(order) {

    var query= `select P.IdPedido,P.CodProducto,pr.Descripcion,P.Cantidad,P.PrecioUnitario, P.FecAlta,P.IdProveedor
    from detallepedido P
    inner join productos pr on pr.CodProducto =P.CodProducto and P.IdProveedor = pr.IdProveedor
    inner join pedidos ped on ped.IdPedido=P.IdPedido 
    WHERE ped.IdFranquicia =${order.idFranquicia}`; 
    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        if (order.idpedido !== undefined){
            query = query + ` AND P.IdPedido=${order.idpedido}`;
        }

        if (order.vigente !== undefined){
            //Pedir que manden S o N
            query = query + ` AND ped.SnFinalizado=${order.vigente}`;
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



module.exports = {
    saveOrder,
    getOrders,
    getOrderById,
    getOrderbyFranquicia,
    getOrdersOnProgress,
    getOrdersFinished,
    getOrdersDetail,
    getOrderDetailbyFranquicia,
    updateOrderStatus
}