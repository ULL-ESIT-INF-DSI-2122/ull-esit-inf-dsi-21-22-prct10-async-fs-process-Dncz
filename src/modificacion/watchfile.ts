import {access, constants, watch} from 'fs';
import {spawn} from 'child_process';

/**
 * Clase WatchClass
 */
export class WatchClass {
  /**
   * Constructor
   * @param {string} fichero Nombre del fichero
   */
  constructor(private fichero: string, private comando: string) {
    // comprobación si el fichero existe
    access(fichero, constants.F_OK, (error) => {
      if (error) {
        console.log(`El fichero ${fichero} no existe`);
      } else {
        this.run();
      }
    });
  }

  /**
   * Función suma los datos del fichero
   * @param {string[]} arraydatos Datos leídos del fichero
   */
  private suma(arraydatos: string[]) {
    let resultado: number = 0;
    arraydatos.forEach((elemento) => {
      resultado += parseInt(elemento);
    });
    console.log(`Resultado suma: ${resultado}`);
    // watch(this.fichero, (evento, ficheroNombre) => {
    //   if (evento == 'change') {
    //     readFile(this.fichero, (err, data) => {
    //       if (err) {
    //         console.log('Problemas con la lectura del fichero que quieres leer');
    //       } else {
    //         const arrayString = data.toString().split(' ');
    //         let resultado: number = 0;
    //         arrayString.forEach((elemento) => {
    //           resultado += parseInt(elemento);
    //         });
    //         console.log(`Resultado: ${resultado}`);
    //       }
    //     });
    //   } else if (evento =='rename') {
    //     console.log(`${ficheroNombre}  ha sido eliminado`);
    //   } else {
    //     console.log(`${ficheroNombre}  no tiene cambios`);
    //   }
    // });
  }

  /**
   * Función multiplicación de los datos del fichero
   * @param {string[]} arraydatos Datos leídos del fichero
   */
  private mult(arraydatos: string[]) {
    let resultado: number = 1;
    arraydatos.forEach((elemento) => {
      resultado *= parseInt(elemento);
    });
    console.log(`Resultado: ${resultado}`);
  }

  /**
   * Función principal
   */
  private run() {
    watch(this.fichero, (evento, ficheroNombre) => {
      if (evento == 'change') {
        const childProcess = spawn('cat', [this.fichero]);
        let comandoOut = '';
        childProcess.stdout.on('data', (piece) => comandoOut += piece);
        childProcess.on('close', () => {
          if (this.comando == '+') {
            this.suma(comandoOut.toString().split(' '));
          }
          if (this.comando == '*') {
            this.mult(comandoOut.toString().split(' '));
          }
        });
      } else if (evento =='rename') {
        console.log(`${ficheroNombre}  ha sido eliminado`);
      } else {
        console.log(`${ficheroNombre}  no tiene cambios`);
      }
    });
  }
}

/**
 * Ejecución del programa
 */
if (process.argv.length < 3) {
  console.log('No has especificado el fichero');
} else {
  const filename = process.argv[2];
  const comando = process.argv[3];
  new WatchClass(filename, comando);
}
