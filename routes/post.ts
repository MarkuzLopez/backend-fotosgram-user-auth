import { verificarToken } from './../middleware/autenticacion';
import { Router, Response } from 'express';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-ssystem';

const postRoutes = Router();
const fileSystem =  new FileSystem();

// Obtener POST paginados. 
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina =  Number(req.query.pagina) || 1; // obtener el valor en la peticion url.
    let skip = pagina - 1; 
    skip =  skip * 10;
    
    const posts =  await Post.find()
                             .sort({_id: -1}) /// ordenar de manera descendente.
                             .skip(skip) // hacer la paginacion
                             .limit(10) // limite hasta que numero mostrar
                             .populate('usuario', '-password') // mostrar informacion del usuario y ocultar el password
                             .exec(); /// ejecutar ekl query

    res.json({
        ok: true,
        pagina,
        posts
    })
})


// crear POSST. 

postRoutes.post('/', [verificarToken], (req: any, res: Response) => {

    const body = req.body;

    body.usuario = req.usuario._id;

    /// obtener las imagenes 
    const imagenes =  fileSystem.imgDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;

    Post.create(body).then( async postDB => {

        // cambiar el id del objeto por el objeto del usuario 
        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        })
    }).catch( err => {
        res.json(err);
    });
});

// Servicio para subir archivos.
postRoutes.post('/upload', [verificarToken], async (req: any, res: Response) => {
    
    if(!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    // validacion si el archivo no exisste.
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        })
    }

    /// validacion si no se incvluye el image 
    if(!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }

    // crear la carpeta upload en la carpeta dist/
    await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });
}); 


// obetener las imaagenes por medio del isUsuario.
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
    
    const userId =  req.params.userid;
    const img    =  req.params.img;

    const pathFoto =  fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
});


export default postRoutes;
