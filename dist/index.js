"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./classes/server"));
var usuario_1 = __importDefault(require("./routes/usuario"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var server = new server_1.default();
// Body parser, para las peticiones posst, get, put, delete, REST-FULL.
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Rutas o middellware
server.app.use('/user', usuario_1.default);
/// Conectar Mongo BD.
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, function (err) {
    if (err)
        throw err; // si existe error mandarlo y cerrar 
    console.log('Base de datos ONLINE');
});
/// levanta el sservicio 
server.start(function () {
    console.log("servidor corriendo en puerto " + server.port);
});
