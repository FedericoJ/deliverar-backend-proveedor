
var StompJs = require("stompjs");
var SockJS = require("sockjs-client");

var stompClient = null;
var socket = new SockJS('http://core.deliver.ar/websocket');
const order = require('../services/orders');
    
stompClient = StompJs.over(socket);

function connect(){

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/user', function (user) {
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
            console.log("me llego mensaje de franquicia con: "+ mensaje.contenido)
                try{
                    var result = await order.saveOrder(JSON.parse(mensaje.contenido));
                }catch(error){
                    console.log(error);
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