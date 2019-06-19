"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_mode_1 = require("../models/usuario.mode");
var bcrypt_1 = __importDefault(require("bcrypt"));
var token_1 = __importDefault(require("../classes/token"));
var autenticacion_1 = require("../middleware/autenticacion");
var userRoutes = express_1.Router();
/// Login
userRoutes.post('/login', function (req, res) {
    var body = req.body;
    usuario_mode_1.Usuario.findOne({ email: body.email }, function (err, userDB) {
        if (err)
            throw err; /// ssieexiste error sale y muestra el error
        // si el usuario no existe mandar el mensaje
        if (!userDB) {
            res.json({
                ok: true,
                mensaje: 'Ussuario/Contraseña no son correctos'
            });
        }
        // si las contrasseña coinciden y el email entncess genera el token
        if (userDB.compararPassword(body.password)) {
            // generar el token 
            var tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            // si las contraseñas coinciden 
            return res.json({
                ok: false,
                mensaje: 'Usuario/password no son correctas'
            });
        }
    });
});
/// creacion de usuarioss
userRoutes.post('/create', function (req, res) {
    var user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    /// modelo para crear la base de datos 
    usuario_mode_1.Usuario.create(user).then(function (userDB) {
        var tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(function (err) {
        res.json({
            ok: false,
            err: err
        });
    });
});
// Actualizar usuario.
userRoutes.post('/update', autenticacion_1.verificarToken, function (req, res) {
    var user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_mode_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, function (err, userDB) {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: true,
                mensaje: 'No existe el usuario con ese ID'
            });
        }
        /// Si pasa las validaciones y esta correctamente hay que generar elñ nuevo token 
        var tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
exports.default = userRoutes;
