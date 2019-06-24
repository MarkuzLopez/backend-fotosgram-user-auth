"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = __importDefault(require("../classes/token"));
exports.verificarToken = function (req, res, next) {
    var userToken = req.get('x-token') || '';
    token_1.default.comprobarToken(userToken).then(function (decoded) {
        // console.log('Decodeed', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch(function (err) {
        res.json({
            ok: true,
            mensaje: 'Token no es valido'
        });
    });
};
