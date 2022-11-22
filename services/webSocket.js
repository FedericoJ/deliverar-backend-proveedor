
var StompJs = require("stompjs");
var SockJS = require("sockjs-client");

var stompClient = null;
var socket = new SockJS('http://core.deliver.ar/proveedor');
const order = require('../services/orders');
    
stompClient = StompJs.over(socket);

async function connect(){
   await stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/proveedor', function (user) {
                processMessage(JSON.parse(user.body));
            });
        stompClient.send("/app/proveedor"); //cambiar cliente por el modulo que corresponda
        });

}


function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}


async function processMessage(mensaje) {
    console.log(mensaje);
    if (mensaje !== undefined){
        //console.log(mensaje.contenido) 
       
        if (mensaje.emisor =="franquicia"){
            //console.log(mensaje.contenido)
            let a=JSON.parse(mensaje.contenido)
            if (a.tipo =="nuevo-pedido"){
                try{
                    var result = await order.saveOrder(a.mensaje);
                }catch(error){
                    console.log(error);
                }
            }
        }
        }

        //var jsonMensaje =JSON.parse(mensaje);
        //var prueba= JSON.parse(jsonMensaje.contenido)
        //console.log(JSON.stringify(jsonMensaje));
    }

module.exports={
    connect,
    disconnect,
    processMessage
};