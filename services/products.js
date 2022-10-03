const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function saveProducts(product) {


    try {
        const result = await db.query(
            `insert into productos ( CodProducto, Descripcion,Stock,Precio,FecAlta, IdProovedor) 
            VALUES 
            ('${product.codProducto}', '${product.descripcion}', ${product.stock}, 
            ${product.precio} , now(), '${product.IdProovedor}')`
        );
        
        message = 'Producto guardado correctamente';

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}

async function saveMultipleProducts(product) {
    var currentTime = new Date();

    try {
       
        if (product.products.length > 0) {

            product.products.forEach(async detail => {            
    
                const result1 = await db.query(
                    `insert into productos (CodProducto, Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,Usuario,CuitProveedor) 
                    VALUES 
                    ('${detail.codProducto}', '${detail.descripcion}', '${detail.imagen}', ${detail.stock}, 
                    ${detail.precio} ,  ${detail.medStock} , now() , '${product.usuario}',${product.cuit} )`)
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido guardar los productos requeridos" };
                }
    
            });

        }
      
        return { code: 201, message: "Productos ingresados correctamente" }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}




async function getProducts(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select p.CodProducto,Descripcion,Stock,Precio,of.porcentaje, of.fecDesde,of.fecHasta,FecAlta,FecModificacion,p.IdProveedor from productos p
            left join ofertas of on of.codProducto=p.codProducto and p.IdProveedor=of.cuit
            where IdProveedor=${product.cuit}`
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
            `select CodProducto,Descripcion,Stock,Precio,FecAlta,FecModificacion,IdProveedor from productos 
            where UPPER(CodProducto)=UPPER('${product.codProducto}') and IdProveedor ='${product.cuit}'`
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
            `select CodProducto,Descripcion,Stock,Precio,FecAlta,FecModificacion,IdProveedor from productos 
            where upper(Descripcion) LIKE upper('%${product.descripcion}%') and IdProveedor ='${product.IdProovedor}'`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function updateProductByCode(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `update productos
            set Descripcion='${product.descripcion}',
            Stock='${product.stock}',
            Precio='${product.precio}',
            FecModificacion=now(),
            IdProovedor='${product.IdProovedor}'
            where CodProducto = '${product.CodProducto}' and IdProveedor ='${product.IdProovedor}'`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function deleteProductByCode(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `delete from productos
            where CodProducto = '${product.CodProducto}' and IdProveedor =${product.IdProovedor}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

//Modulo de Ofertas

async function saveOffers(offer) {


    try {
        const result = await db.query(
            `insert into ofertas ( CodProducto, cuit,porcentaje,fecDesde,fecHasta) 
            VALUES 
            ('${offer.codProducto}', ${offer.cuit}, ${offer.porcentaje}, '${offer.fecDesde}' , '${offer.fecHasta}')`
        );
        
        message = 'Oferta guardada correctamente';

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}

async function updateOfferByCode(offer) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `update ofertas
            set porcentaje='${offer.discount}',
            fecDesde=now(),
            fecHasta='${offer.fecHasta}'
            where codProducto = '${offer.CodProducto}' and CuitProveedor =${offer.cuit}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, product: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function deleteOfferbyCode(offer) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `delete from ofertas
            where idOferta = ${offer.id}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, offer: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}






module.exports = {
    saveProducts,
    getProducts,
    getProductbyCode,
    getProductByDescription,
    updateProductByCode,
    deleteProductByCode,
    saveMultipleProducts,
    saveOffers,
    updateOfferByCode,
    deleteOfferbyCode
    
}