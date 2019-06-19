import {Response, Request, NextFunction} from 'express';
import Token from '../classes/token';

export const verificarToken = (req: any, res: Response, next: NextFunction ) => {
    
    const userToken = req.get('x-token') || '' ;

    Token.comprobarToken(userToken).then( (decoded: any) => {
        console.log('Decodeed', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch( err =>  { 
        res.json({ 
            ok: true, 
            mensaje: 'Token no es valido'
        })
    })

}
