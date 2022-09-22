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

async function getUnidades() {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select descripcion as label,idUnidad as value from unidades`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, unidades: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}


async function postIngredientes(ingrediente) {


    try {

       
            const result = await db.query(
                `insert into ingredientes (nombre) 
                VALUES ('${ingrediente}')`
            );

            if (!result.affectedRows) {
                return { code: 400, message: "Error a la hora de cargar un ingrediente" };
            };

        let message = 'Ingrediente creado correctamente';

       

        return { code: 201, message: message }

    } catch (e) {

        return { code: 400, message: e.message };
    }

}

async function getIngredienteUtilizadoPorReceta(multimedia) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 

        const result = await db.query(
            `select I.nombre, U.cantidad, UNI.descripcion, UNI.IdUnidad, R.idReceta
            from Ingredientes I, Utilizados U, recetas R, unidades UNI
            where I.IdIngrediente=U.IdIngrediente
            and R.IdReceta=U.IdReceta
            and UNI.idUnidad=U.Idunidad
            and R.IdReceta=${multimedia.idReceta}`
        );

        const data = helper.emptyOrRows(result);

        return { code: 201, ingredientes: data };

    } catch (e) {
        // return a Error message describing the reason     
        return { code: 400, message: e.message };
    }

}

async function buscarIngrediente(descripcion){
    
    try {
        const result = await db.query(
        `select IdIngrediente from Ingredientes
        where upper(nombre)=upper('${descripcion}')`);
        return result;
    } catch (e) {
        // return a Error message describing the reason     
        return 0;
    }
}






module.exports = {
    saveProducts,
    getProducts,
    getProductbyCode
}