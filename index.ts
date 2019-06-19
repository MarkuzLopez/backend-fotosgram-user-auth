import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body parser, para las peticiones posst, get, put, delete, REST-FULL.
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());


//Rutas o middellware
 server.app.use('/user', userRoutes);


/// Conectar Mongo BD.
mongoose.connect('mongodb://localhost:27017/fotosgram', {useNewUrlParser: true, useCreateIndex: true}, (err) => {
    
        if(err) throw err; // si existe error mandarlo y cerrar 
        
        console.log('Base de datos ONLINE');

})

/// levanta el sservicio 
server.start( ()=>  {
    console.log(`servidor corriendo en puerto ${server.port}`);
})