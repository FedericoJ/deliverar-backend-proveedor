"use strict";
const nodemailer = require("nodemailer");
const usuario = require('../services/usuario');




module.exports = {

  async sendEmailToRecoveryPass(email,linkRecuperador) {

        //`http://localhost:3000/recoverypassword/?token=${token}&mail=${email}`

        console.log(linkRecuperador);

        try{

            let transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "1c8b722665f341",
                      pass: "7dc0d216ea53cf"
                    }
                 
            });

            let info = await transporter.sendMail({
                from: '"Recetas" <recetapp1@distribuidas.com>', // sender address
                to: email,
                subject: "Recuperar Contraseña ✔", // Subject line
                text: "Recuperar Contraseña", // plain text body
                html: `<b>Usted ha solicitado recuperar su contraseña, por favor ingrese el siguiente codigo ${linkRecuperador}</b>`, // html body
            });

            //Agregar Insert del codigo enviado
            
           

           return {code: 200, message: 'Mail de recuperación enviado'}; 

        }catch(e){
            console.log(e.message);
            return {code: 404, message: e.message};


        }

    
    },
    
    async sendEmailToCompleteRegistration(email) {

        try{

            let transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "1c8b722665f341",
                  pass: "7dc0d216ea53cf"
                }
             
        });

            let info = await transporter.sendMail({
                from: '"Recetas" <recetapp1@gmail.com>', // sender address
                to: email,
                subject: "Complete su Login ✔", // Subject line
                text: "Completar Login", // plain text body
                //MRV (08/05): El link lo tiene que llevar a la pagina "Finalizar creacion Usuario"
                html: `¡Bienvenido! Usted se ha registrado en <b>RecetApp</b>. Siga los pasos para registrar su password.`, // html body
            });

            //Agregar Insert del codigo enviado

            if (result.code != 201){

                return {code: 404, message: {result}};

            } 

            return {code: 200, message: 'Mail de login enviado'}; 

        }catch(e){

            return {code: 404, message: e.message};


        }

    
    }

} 