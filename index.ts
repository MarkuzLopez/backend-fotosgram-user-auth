import Server from './classes/server';
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

import cors  from 'cors';

const server = new Server();

// Body parser, para las peticiones posst, get, put, delete, REST-FULL.
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());


// fileUpload 
server.app.use(fileUpload());


/// configuracion de cors
server.app.use(
    cors({ origin: true, credentials: true })
);
 
//Rutas o middellware
 server.app.use('/user', userRoutes);
 server.app.use('/post', postRoutes)

 
/// Conectar Mongo BD.
mongoose.connect('mongodb://localhost:27017/fotosgram', {useNewUrlParser: true, useCreateIndex: true}, (err) => {
    
        if(err) throw err; // si existe error mandarlo y cerrar 
        
        console.log('Base de datos ONLINE');

})

/// levanta el sservicio 
server.start( ()=>  {
    console.log(`servidor corriendo en puerto ${server.port}`);
})