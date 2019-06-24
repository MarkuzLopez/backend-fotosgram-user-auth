"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var autenticacion_1 = require("./../middleware/autenticacion");
var express_1 = require("express");
var post_model_1 = require("../models/post.model");
var file_ssystem_1 = __importDefault(require("../classes/file-ssystem"));
var postRoutes = express_1.Router();
var fileSystem = new file_ssystem_1.default();
// Obtener POST paginados. 
postRoutes.get('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var pagina, skip, posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pagina = Number(req.query.pagina) || 1;
                skip = pagina - 1;
                skip = skip * 10;
                return [4 /*yield*/, post_model_1.Post.find()
                        .sort({ _id: -1 }) /// ordenar de manera descendente.
                        .skip(skip) // hacer la paginacion
                        .limit(10) // limite hasta que numero mostrar
                        .populate('usuario', '-password') // mostrar informacion del usuario y ocultar el password
                        .exec()];
            case 1:
                posts = _a.sent();
                res.json({
                    ok: true,
                    pagina: pagina,
                    posts: posts
                });
                return [2 /*return*/];
        }
    });
}); });
// crear POSST. 
postRoutes.post('/', [autenticacion_1.verificarToken], function (req, res) {
    var body = req.body;
    body.usuario = req.usuario._id;
    /// obtener las imagenes 
    var imagenes = fileSystem.imgDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;
    post_model_1.Post.create(body).then(function (postDB) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // cambiar el id del objeto por el objeto del usuario 
                return [4 /*yield*/, postDB.populate('usuario', '-password').execPopulate()];
                case 1:
                    // cambiar el id del objeto por el objeto del usuario 
                    _a.sent();
                    res.json({
                        ok: true,
                        post: postDB
                    });
                    return [2 /*return*/];
            }
        });
    }); }).catch(function (err) {
        res.json(err);
    });
});
// Servicio para subir archivos.
postRoutes.post('/upload', [autenticacion_1.verificarToken], function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.files) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'No se subio ningun archivo'
                        })];
                }
                file = req.files.image;
                // validacion si el archivo no exisste.
                if (!file) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'No se subio ningun archivo - image'
                        })];
                }
                /// validacion si no se incvluye el image 
                if (!file.mimetype.includes('image')) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'Lo que subio no es una imagen'
                        })];
                }
                // crear la carpeta upload en la carpeta dist/
                return [4 /*yield*/, fileSystem.guardarImagenTemporal(file, req.usuario._id)];
            case 1:
                // crear la carpeta upload en la carpeta dist/
                _a.sent();
                res.status(200).json({
                    ok: true,
                    file: file.mimetype
                });
                return [2 /*return*/];
        }
    });
}); });
// obetener las imaagenes por medio del isUsuario.
postRoutes.get('/imagen/:userid/:img', function (req, res) {
    var userId = req.params.userid;
    var img = req.params.img;
    var pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
