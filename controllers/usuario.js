const mysql =require('mysql');

function insert(connection,callback){
    let insertQuery = "insert into usuarios (mail,nickname,habilitado,nombre,avatar,fecAlta,diasAlta,password) values ('aaaaaa','holis','si','chriiis','avaaaaa','2022/10/10',11,'123456')";

    connection.query(insertQuery,function(err,result){
        if (err) throw err;
        callback(result);
    })


}

module.exports={insert};

