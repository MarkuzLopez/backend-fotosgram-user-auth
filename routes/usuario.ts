import {Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.mode';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificarToken } from '../middleware/autenticacion';

const userRoutes = Router();

/// Login
userRoutes.post('/login', (req: Request, res: Response ) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, ( err, userDB ) => {

        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if ( userDB.compararPassword( body.password ) ) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
            });

        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        }


    })


});

/// creacion de usuarioss
userRoutes.post('/create', (req: Request, res: Response) => {
    
    const user = {
        nombre : req.body.nombre,
        email  : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10) ,
        avatar: req.body.avatar
    }

    /// modelo para crear la base de datos 
    Usuario.create(user).then(userDB => { 

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    }).catch( err => { 
        res.json({
            ok: false,
            err
        });
    });

})

// Actualizar usuario.
userRoutes.post('/update', verificarToken, (req: any, res: Response) => {
    
    const user = { 
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user ,{new: true}, (err, userDB) => { 

        if( err) throw err;

        if(!userDB) {
            return res.json({
                ok: true,
                mensaje: 'No existe el usuario con ese ID'
            });
        }

        /// Si pasa las validaciones y esta correctamente hay que generar elñ nuevo token 
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    })
    
});

/// obtener al usuario 
userRoutes.get('/', [verificarToken], (req: any, ress: Response) => {
    
    const usuario = req.usuario;

    ress.json({
        ok: true,
        usuario
    })

})

export default userRoutes;