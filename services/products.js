const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const axios = require('axios');

async function saveProducts(product) {


    try {
        const result = await db.query(
            `insert into productos ( CodProducto, Descripcion,Stock,Precio,FecAlta, IdProveedor) 
            VALUES 
            ('${product.codProducto}', '${product.descripcion}', ${product.stock}, 
            ${product.precio} , now(), '${product.cuit}')`
        );
        
        message = 'Producto guardado correctamente';

        const get = await this.getProducts("prueba");

        //console.log(JSON.stringify(get.products));
        var body=get.products;
        body.push({"tipo":"listado"});
        

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("mensaje de productos enviado");
            })
            .catch(error =>{
                console.log(error);
            })

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
                    `insert into productos (CodProducto, Descripcion,Imagen,Stock,Precio,MediaStock,FecAlta,Usuario,IdProveedor) 
                    VALUES 
                    ('${detail.codProducto}', '${detail.descripcion}', '${detail.imagen}', ${detail.stock}, 
                    ${detail.precio} ,  ${detail.medStock} , now() , '${product.usuario}',${product.cuit} )`)
    
                if (!result1.affectedRows) {
                    return { code: 400, message: "No se han podido guardar los productos requeridos" };
                }
    
            });

            const get = await this.getProducts("prueba");

            const body=get.products;

            axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
                .then(response =>{
                    console.log("mensaje de productos enviado");
                })
                .catch(error =>{
                    console.log(error);
                })

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
        var query = `select Descripcion,CodProducto,Stock,
        P.precio, 
        cast(ifnull((select porcentaje from ofertas O where O.CodProducto=P.CodProducto and P.IdProveedor=O.cuit),0) as decimal(5,2)) as porcentaje,
        ifnull(concat(concat(concat(concat(day((select right(cast(fecHasta as date),10) from ofertas O where O.CodProducto=P.CodProducto and P.IdProveedor=O.cuit)),'/'),month((select right(cast(fecHasta as date),10) from ofertas O where O.CodProducto=P.CodProducto and P.IdProveedor=O.cuit))),'/'),year((select right(cast(fecHasta as date),10) from ofertas O where O.CodProducto=P.CodProducto and P.IdProveedor=O.cuit))),'') as FechaVigencia,
        ifnull(case when (select 1 from ofertas O where O.CodProducto=P.CodProducto and P.IdProveedor=O.cuit and now()>O.fecDesde and now()<O.fechasta) then
            'Activa'
            end,'No Activa') as EstadoOferta,
        concat(concat(concat(concat(day(FecAlta),'/'),month(FecAlta)),'/'),year(FecAlta)) as FecAlta,
        IdProveedor
        from productos P 
        where 1 = 1`

        if (product.cuit !==undefined){
            query =query + ` AND IdProveedor='${product.cuit}'`
        }

        const result = await db.query(query);



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
            `select CodProducto,Descripcion,Stock,
            ifnull((select P.Precio*O.Porcentaje/100 from Ofertas O where O.CodProducto=P.CodProducto and O.cuit=P.IdProveedor and now()<O.fechasta and now()>O.fecdesde),Precio) as Precio,
            FecAlta,FecModificacion,IdProveedor from productos P 
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
            `select CodProducto,Descripcion,Stock,
            ifnull((select P.Precio*O.Porcentaje/100 from Ofertas O where O.CodProducto=P.CodProducto and O.cuit=P.IdProveedor and now()<O.fechasta and now()>O.fecdesde),Precio) as Precio,
            FecAlta,FecModificacion,IdProveedor from productos P 
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
            IdProveedor='${product.cuit}'
            where CodProducto = '${product.codProducto}' and IdProveedor ='${product.cuit}'`
        );

        const data = helper.emptyOrRows(result);

        const get = await this.getProducts("prueba");

        //console.log(JSON.stringify(get.products));
        const body=get.products;

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("mensaje de productos enviado");
            })
            .catch(error =>{
                console.log(error);
            })

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
            `delete from ofertas
            where codProducto = '${product.codProducto}' and cuit =${product.cuit}`
        );

        
        const result1 = await db.query(
                `delete from productos
                where CodProducto = '${product.codProducto}' and IdProveedor =${product.cuit}`
            );
            if (!result1.affectedRows) {
                return { code: 400, message: "No se ha podido eliminar el producto" };
            }
        
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
            ('${offer.codProducto}', ${offer.cuit}, ${offer.porcentaje}, now() , '${offer.fecHasta}')`
        );
        
        message = 'Oferta guardada correctamente';

        const get = await this.getProducts("prueba");

        //console.log(JSON.stringify(get.products));
        const body=get.products;

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("mensaje de productos enviado");
            })
            .catch(error =>{
                console.log(error);
            })

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
            `Select (select Descripcion from productos P where P.CodProducto=O.CodProducto and O.cuit=P.IdProveedor) as NombreProducto,
            CodProducto,
            Porcentaje as Descuento,
            fecHasta as FecVigenciaOferta
            from Ofertas O
            where CodProducto='${offer.CodProducto}'
            and cuit='${offer.cuit}'`
        );
        if(result.length>0){
            const result1 = await db.query(
                `update ofertas
                set porcentaje='${offer.discount}',
                fecDesde=now(),
                fecHasta='${offer.fecHasta}'
                where codProducto = '${offer.CodProducto}' and Cuit =${offer.cuit}`);
            if (!result1.affectedRows) {
                return { code: 400, message: "No se ha podido guardar la oferta requerida" };
            }
        }else{
            const result2 = await db.query(
                `insert into ofertas ( CodProducto, cuit,porcentaje,fecDesde,fecHasta) 
                VALUES 
                ('${offer.CodProducto}', ${offer.cuit}, ${offer.discount}, now() , '${offer.fecHasta}')`);
            if (!result2.affectedRows) {
                return { code: 400, message: "No se ha podido guardar la oferta requerida" };
            }
        }

        const data = helper.emptyOrRows(result);

        const get = await this.getProducts("prueba");

        //console.log(JSON.stringify(get.products));
        const body=get.products;

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("mensaje de productos enviado");
            })
            .catch(error =>{
                console.log(error);
            })

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

        const get = await this.getProducts("prueba");

        //console.log(JSON.stringify(get.products));
        const body=get.products;

        axios.post(`http://core.deliver.ar/publicarMensaje?canal=proveedor`,body)
            .then(response =>{
                console.log("mensaje de productos enviado");
            })
            .catch(error =>{
                console.log(error);
            })

        return { code: 201, offer: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function getOffer(product) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `Select (select Descripcion from productos P where P.CodProducto=O.CodProducto and O.cuit=P.IdProveedor) as NombreProducto,
            CodProducto,
            Porcentaje as Descuento,
            fecHasta as FecVigenciaOferta
            from Ofertas O
            where CodProducto='${product.CodProducto}'
            and cuit='${product.cuit}'`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, products: data };

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
    deleteOfferbyCode,
    getOffer
    
}