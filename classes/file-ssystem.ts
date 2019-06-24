import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    
    constructor() {}

    guardarImagenTemporal(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            // crear caarpetas
            const path = this.crearCarpetaUsuario(userId);

            // nombre archivo 
            const nombreArchivo = this.generarNombreUnico(file.name);
            // console.log('name archivo',file.name);
            // console.log('nombre unico', nombreArchivo);

            // Mover el archivo del Temp a nuesstra carpeta.
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {

                if (err) {
                    // si existe error no se pudo mover
                    reject(err);
                } else {
                    /// todo salio bien
                    resolve();
                }
            });

        });
    }

    private generarNombreUnico(nombreOriginal: string) {
        /// realizar un arreglo de tre  para obtener lo ssiguiente (6.copy.jpg) separado
        const nombreArr =  nombreOriginal.split('.');
       // console.log('name arreglo ssplit: , ',nombreArr);
        const extension =  nombreArr[nombreArr.length -1]; 
       // console.log('extension: ',extension);
        const nombreUnico =  uniqid();
       // console.log('libreria uniqid' ,nombreUnico);
        
        return `${nombreUnico}.${extension}`;
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve( __dirname, '../uploads', userId);
        const pathUserTemp =  pathUser + '/temp';
        // console.log(pathUser);
        // console.log(pathUserTemp);
        
        const existe =  fs.existsSync(pathUser);

        if(!existe) {
            fs.mkdirSync( pathUser) ;
            fs.mkdirSync( pathUserTemp );
        }
        
        return pathUserTemp;
    }


    imgDeTempHaciaPost(userId: string) {
        
        const pathTemp =  path.resolve( __dirname, '../uploads', userId, 'temp');
        const pathPost =  path.resolve( __dirname, '../uploads', userId, 'posts');

        // si no existe el pathTemp, regresar un arreglo vacio. 
        if(!fs.existsSync(pathTemp)) {
            return [];
        }

        /// si no existe la carpeta posts crearla 
        if(!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp =  this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        
        /// retornamos los nombres  de las imagenes.
        return imagenesTemp;

    }

    private obtenerImagenesEnTemp(userId: string) {
        
        const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp' );
        // maanddar el pathTemp o un aarreglo vacio si no tiene el path.
        return fs.readdirSync(pathTemp) || [];

    }
   
    getFotoUrl(userId: string, img: string) {

        // path Posts 
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img);

        // si la imagen existe
        const existe = fs.existsSync(pathFoto);
        if(!existe) {
            return path.resolve( __dirname, '../assets/400x250.jpg');
        }
        
        return pathFoto;
    }

      
}