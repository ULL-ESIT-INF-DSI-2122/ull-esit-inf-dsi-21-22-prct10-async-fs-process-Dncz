import {access, constants, watch} from 'fs';
import chalk from 'chalk';
import * as yargs from 'yargs';

/**
 * Clase WatchDir que sólo observa el directorio del usuario
 * si hay cambios como: añadir nota, modificar y eliminar
 */
export class WatchDir {
  constructor(private userName: string, private pathDir: string) {}
  /**
   * Function that watches changes in the directory
   */
  public watchDir() {
    const path: string = this.pathDir + '/' + this.userName;
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(path + ' does not exist'));
      } else {
        watch(path, (event, files) => {
          if (event === 'change') {
            console.log(chalk.blue('Changes have occurred in ' + path));
          } else if (event === 'rename') {
            access(path, (constants.F_OK, (err) => {
              if (err) {
                console.log(chalk.yellow(files + ' has been deleted'));
              } else {
                console.log(chalk.yellow(files + ' has been created'));
              }
            }));
          } else {
            console.log(chalk.yellow(path + ' has no changes'));
          }
        });
      }
    });
  }
}


/**
 * Comando que ejecuta el método watchDir()
 * Ejemplo de ejecución:
 *  node dist/ejercicio3/ejercicio3.js watch --user="dana" --path="src/notes
 */
yargs.command({
  command: 'watch',
  describe: 'Look at the user directory',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    path: {
      describe: 'Directory name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.path === 'string') {
      const watchDirObject = new WatchDir(argv.user, argv.path);
      watchDirObject.watchDir();
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});

yargs.parse();
