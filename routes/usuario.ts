import {Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.mode';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificarToken } from '../middleware/autenticacion';

const userRoutes = Router();

/// Login
userRoutes.post('/login', (req: Request, res: Response) => {
    
    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {

        if(err) throw err; /// ssieexiste error sale y muestra el error

        // si el usuario no existe mandar el mensaje
        if(!userDB) {
            res.json({
                ok: true,
                mensaje: 'Ussuario/Contraseña no son correctos'
            });   
        }

        // si las contrasseña coinciden y el email entncess genera el token
        if( userDB.compararPassword(body.password))  {

            // generar el token 
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
        // si las contraseñas coinciden 
            return res.json({
                ok: false,
                mensaje: 'Usuario/password no son correctas'
            })
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

export default userRoutes;