import {access, constants, watch} from 'fs';
// import {spawn} from 'child_process';
import chalk from 'chalk';
import * as yargs from 'yargs';
// import {Note} from './note';
/**
 * Una clase que sólo mire el directorio del usuario y ver los cambios
 * que pasan: añadir nota, modificar y eliminar.
 */
export class WatchClass {
  constructor(private usuario: string) {
    this.mirar();
  }

  /**
   * ERROR: SE CONFUNDE EL EVENTO RENAME CON CHANGE CUANDO
   * SE HACE ADD
   * FALTA: AÑADIR PARA TODOS LOS USUARIOS..-
   */
  private mirar() {
    let path: string = './src/notes/' + this.usuario;
    // let file: string = '/' + this.nota.getName() + '.json';
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red('El fichero ' + ' no existe'));
      } else {
        watch(path, (evento, files) => {
          console.log(chalk.white(evento.toString()));
          if (evento == 'change') {
            console.log(chalk.blue('Se ha añadido ' + files +' al directorio'));
          } else if (evento == 'rename') {
            console.log(chalk.yellow(files + ' se ha eliminado'));
          } else {
            console.log(chalk.yellow(files + ' no tiene cambios'));
          }
        });
      }
    });
  }
}

yargs.command({
  command: 'watch',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const mirar = new WatchClass(argv.user);
    } else {
      console.log(chalk.red("Error: Argumentos inválidos"));
    }
  },
});

yargs.parse();
