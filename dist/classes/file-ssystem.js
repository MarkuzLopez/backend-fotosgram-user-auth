"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var uniqid_1 = __importDefault(require("uniqid"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    FileSystem.prototype.guardarImagenTemporal = function (file, userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // crear caarpetas
            var path = _this.crearCarpetaUsuario(userId);
            // nombre archivo 
            var nombreArchivo = _this.generarNombreUnico(file.name);
            // console.log('name archivo',file.name);
            // console.log('nombre unico', nombreArchivo);
            // Mover el archivo del Temp a nuesstra carpeta.
            file.mv(path + "/" + nombreArchivo, function (err) {
                if (err) {
                    // si existe error no se pudo mover
                    reject(err);
                }
                else {
                    /// todo salio bien
                    resolve();
                }
            });
        });
    };
    FileSystem.prototype.generarNombreUnico = function (nombreOriginal) {
        /// realizar un arreglo de tre  para obtener lo ssiguiente (6.copy.jpg) separado
        var nombreArr = nombreOriginal.split('.');
        // console.log('name arreglo ssplit: , ',nombreArr);
        var extension = nombreArr[nombreArr.length - 1];
        // console.log('extension: ',extension);
        var nombreUnico = uniqid_1.default();
        // console.log('libreria uniqid' ,nombreUnico);
        return nombreUnico + "." + extension;
    };
    FileSystem.prototype.crearCarpetaUsuario = function (userId) {
        var pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        var pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        // console.log(pathUserTemp);
        var existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    };
    FileSystem.prototype.imgDeTempHaciaPost = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        var pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        // si no existe el pathTemp, regresar un arreglo vacio. 
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        /// si no existe la carpeta posts crearla 
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        var imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(function (imagen) {
            fs_1.default.renameSync(pathTemp + "/" + imagen, pathPost + "/" + imagen);
        });
        /// retornamos los nombres  de las imagenes.
        return imagenesTemp;
    };
    FileSystem.prototype.obtenerImagenesEnTemp = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        // maanddar el pathTemp o un aarreglo vacio si no tiene el path.
        return fs_1.default.readdirSync(pathTemp) || [];
    };
    FileSystem.prototype.getFotoUrl = function (userId, img) {
        // path Posts 
        var pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        // si la imagen existe
        var existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    };
    return FileSystem;
}());
exports.default = FileSystem;
