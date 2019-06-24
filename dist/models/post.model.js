"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var postSchema = new mongoose_1.Schema({
    fechaCreacion: {
        type: Date
    },
    mensaje: {
        type: String
    },
    imgs: [{
            type: String
        }],
    cordenadas: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir unaa referencia a un usuario']
    }
});
postSchema.pre('save', function (next) {
    this.fechaCreacion = new Date;
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
