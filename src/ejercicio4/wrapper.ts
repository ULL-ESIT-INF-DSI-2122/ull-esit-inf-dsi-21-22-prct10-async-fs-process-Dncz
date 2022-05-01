import {access, constants, lstat, mkdir, readdir, readFile, rename} from 'fs';
import chalk from 'chalk';
import {spawn} from 'child_process';

/**
 * Clase Wrapper: implementa las funciones los distintos comandos
 * empleados enLinux para el manejo de ficheros y directorios
 */
export class Wrapper {
  /**
   * Constructor
   * @param {string} path Ruta concreta a la cuál queremos operar
   */
  constructor(private path: string) {}

  /**
   * Función que comprueba, dada una ruta, si es un directorio
   * o fichero
   */
  public checkFileOrDir() {
    access(this.path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(err));
      } else {
        lstat(this.path, (err, stats) => {
          if (err) {
            return console.log(chalk.red(err));
          }
          if (stats.isFile()) {
            console.log(chalk.magenta.italic(this.path + ' is a file'));
          } else if (stats.isDirectory()) {
            console.log(chalk.magenta.italic(this.path + ' is a directory'));
          } else {
            console.log(chalk.red('It is not a file or directory...'));
          }
        });
      }
    });
  }

  /**
   * Función que crea un nuevo directorio a partir de la ruta
   */
  public mkdir() {
    const path2 = './src/' + this.path;
    access(path2, constants.F_OK, (err) => {
      if (err) {
        mkdir(path2, {recursive: true}, (err) => {
          if (err) {
            console.log(chalk.red('Failed to create directory'));
          } else {
            console.log(chalk.green.italic('The file has been created successfully'));
          }
        });
      } else {
        console.log(chalk.yellow.italic(this.path + ' already exists...'));
      }
    });
  }

  /**
   * Función que lista el contenido de un directorio
   */
  public lsDir() {
    access(this.path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(this.path + ' does not exist'));
      } else {
        readdir(this.path, (err, files) => {
          if (err) {
            console.log(chalk.red('Error listing directory content'));
          } else {
            files.forEach((file) => {
              console.log(chalk.cyan.italic(file));
            });
          }
        });
      }
    });
  }

  /**
   * Muestra el contenido del fichero
   * @param {string} file Nombre del fichero
   */
  public catFile(file: string) {
    const path2 = this.path + file;
    access(path2, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(path2 +' does not exist'));
      } else {
        readFile(path2, (err, data) => {
          if (err) throw err;
          console.log(chalk.magenta.italic(data.toString()));
        });
      }
    });
  }

  /**
   * Borra el contenido de un directorio o fichero concreto
   * @param thingToDelete Nombre del directorio o fichero a eliminar
   */
  public remove(thingToDelete: string) {
    const path2 = this.path + thingToDelete;
    access(path2, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(path2 + ' does not exist'));
      } else {
        // lstat(path2, (err, stats) => {
        //   if (err) {
        //     return console.log(err + 'esta ruta no existe');
        //   }
        //   if (stats.isFile()) {
        //     rm(path2, (err) => {
        //       if (err) {
        //         console.log('ERROR 2: error al elimnar el fichero');
        //       } else {
        //         console.log(chalk.green('El fichero ' + thingToDelete + ' se ha eliminado'));
        //       }
        //     });
        //   } else if (stats.isDirectory()) {
        //     rm(path2, {recursive: true}, (err) => {
        //       if (err) {
        //         console.log('ERROR 3: error al elimiar el directorio');
        //       } else {
        //         console.log(chalk.magenta('El directorio ' + thingToDelete + ' es un directorio'));
        //       }
        //     });
        //   } else {
        //     console.log(chalk.red('ERROR 4'));
        //   }
        // });
        const rmChild = spawn('rm', ['-r', path2]);
        rmChild.stdout.pipe(process.stdout);
        rmChild.on('close', (err) => {
          if (err !== 0) {
            console.log(chalk.red('Failed to delete'));
          } else {
            console.log(chalk.green.italic(thingToDelete + ' has been successfully removed'));
          }
        });
      }
    });
  }

  /**
   * Mueve el contenido pasado por parámetro a la nueva ruta
   * @param newPath Nueva ruta
   * @param thingToMove Fichero o directorio a mover
   */
  public move(newPath: string, thingToMove: string) {
    const oldPath = this.path + thingToMove;
    access(oldPath, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(oldPath + ' does not exist'));
      } else {
        rename(oldPath, newPath + '/' + thingToMove, (err) => {
          if (err) {
            console.log(chalk.red('Error al mover ' + thingToMove));
          } else {
            console.log(chalk.green.italic('Successfully moved'));
          }
        });
      }
    });
  }

  /**
   * Copia el contenido pasado por parámetro a la nueva ruta
   * @param newPath Nueva ruta
   * @param thingToCopy Fichero o directorio a copiar
   */
  public copy(newPath: string, thingToCopy: string) {
    const oldPath = this.path + thingToCopy;
    access(oldPath, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(oldPath + ' does not exist'));
      } else {
        const copyChild = spawn('cp', ['-r', oldPath, newPath]);
        copyChild.stdout.pipe(process.stdout);
        console.log(chalk.green.italic('Successfully copied'));
      }
    });
  }
}
