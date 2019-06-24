import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({

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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir unaa referencia a un usuario']
    }
});

postSchema.pre<IPost>('save', function(next){
    this.fechaCreacion = new Date;
    next();
});

interface IPost extends Document {
    fechaCreacion: Date;
    mensaje: string;
    img: string[];
    cordenadas: string;
    usuario: string;
}

export const Post = model<IPost>('Post', postSchema)
