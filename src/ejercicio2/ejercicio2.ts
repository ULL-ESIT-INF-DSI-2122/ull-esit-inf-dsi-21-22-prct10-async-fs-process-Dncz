import {access, constants, watch} from 'fs';
import {spawn} from 'child_process';
import chalk from 'chalk';


/**
 * Clase ComandCatAndGrep
 */
export class ComandCatAndGrep {
  /**
   * Constructor
   */
  constructor() {}

  /**
   * Cuenta el número de ocurrencias de una atructura de datos que
   * alamcena cada palabra de la frase leía del comando grep
   * @param {string[]} phrase Contenido leído por el comando grep
   * @returns Número de ocurrencias encontradas
   */
  public find(phrase: string[], word: string): number {
    let found: number = 0;
    phrase.forEach((word1) => {
      if (word == word1) {
        found++;
      }
    });
    return found;
  }

  /**
   * Método que ejecuta el comando cat y grep sin usar pipe
   * Creando los subprocesos necesarios y registrando manejadores
   * @param {string} file Nombre del fichero
   * @param {string} word Palabra a buscar
   */
  public runWithoutPipe(file: string, word: string) {
    watch(file, (event, fileName) => {
      if (event == 'change') {
        const catChildProcess = spawn('cat', [file]);
        const grepChildProcess = spawn('grep', [word.toString()]);

        catChildProcess.stdout.on('data', (dataCommandCat) => {
          grepChildProcess.stdin.write(dataCommandCat);
        });

        catChildProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(chalk.red('cat process exited with code ' + code));
          }
          grepChildProcess.stdin.end();
        });

        let comandoOut = '';
        grepChildProcess.stdout.on('data', (dataCommandGrep) => comandoOut += dataCommandGrep);
        grepChildProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(chalk.red('grep process exited with code ' + code));
          }
          console.log(comandoOut.toString());
          let concurrence: number = this.find(comandoOut.toString().split(/[\s+\-./]/), word);
          console.log(chalk.magenta.italic('Numbers of occurrences of the word ' +
                      word + ': ' + concurrence.toString()));
        });
      } else if (event =='rename') {
        console.log(chalk.red(fileName + ' has been deleted'));
      } else {
        console.log(chalk.red(fileName + ' has no changes'));
      }
    });
  }

  /**
   * Método que ejecuta el comando cat y grep usando pipe
   * @param {string} file Nombre del fichero
   * @param {string} word Palabra a buscar
   */
  public runWithPipe(file: string, word: string) {
    watch(file, (event, fileName) => {
      if (event == 'change') {
        const catChildProcess = spawn('cat', [file]);
        const grepChildProcess = spawn('grep', [word.toString()]);

        catChildProcess.stdout.pipe(grepChildProcess.stdin);

        let comandoOut = '';
        grepChildProcess.stdout.on('data', (piece) => comandoOut += piece);
        grepChildProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(`grep process exited with code ${code}`);
          }
          let concurrence: number = this.find(comandoOut.toString().split(/[\s+\-./]/), word);
          console.log(chalk.magenta.italic('Numbers of occurrences of the word ' +
                      word + ': ' + concurrence.toString()));
          process.stdout.write(comandoOut);
        });
      } else if (event =='rename') {
        console.log(chalk.red(fileName + ' has been deleted'));
      } else {
        console.log(chalk.red(fileName + ' has no changes'));
      }
    });
  }
}

/**
 * Ejecución del programa
 */
const fileName = process.argv[2];
access(fileName, constants.F_OK, (err) => {
  if (err) {
    console.log(chalk.red(fileName + ' does not exist'));
  } else {
    if (process.argv.length < 3) {
      console.log(chalk.yellow('Specify the file name'));
    } else if (process.argv[3] == 'pipe' ) {
      console.log(chalk.magenta.italic('Execution with pipe'));
      const word = process.argv[4];
      const exercise = new ComandCatAndGrep();
      exercise.runWithPipe(fileName, word);
    } else {
      console.log(chalk.magenta.italic('Execution without pipe'));
      const word = process.argv[3];
      const exercise = new ComandCatAndGrep();
      exercise.runWithoutPipe(fileName, word);
    }
  }
});
