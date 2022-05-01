import {access, constants, watch} from 'fs';
import {spawn} from 'child_process';
import chalk from 'chalk';

/**
 * Clase WatchClass
 */
export class WatchClass {
  /**
   * Constructor
   * @param {string} fichero Nombre del fichero
   * @param {string} comando suma o producto
   */
  constructor(private fichero: string, private comando: string) {}

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
  }

  /**
   * Función multiplicación de los datos del fichero
   * @param {string[]} arraydatos Datos leídos del fichero
   */
  private mult(arraydatos: string[]) {
    let resultado: number = 1;
    arraydatos.forEach((elemento) => {
      resultado = resultado * parseInt(elemento);
    });
    console.log(`Resultado: ${resultado}`);
  }

  /**
   * Función principal
   */
  public run() {
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
const fileName = process.argv[2];
if (process.argv.length < 3) {
  console.log('No has especificado el fichero');
} else {
  // comprobación si el fichero existe
  access(fileName, constants.F_OK, (err) => {
    if (err) {
      console.log(chalk.red(fileName + ' no existe'));
    } else {
      const comando = process.argv[3];
      const programa = new WatchClass(fileName, comando);
      programa.run();
    }
  });
}
