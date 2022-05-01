import * as yargs from 'yargs';
import chalk from 'chalk';
import {Wrapper} from './wrapper';


/**
 * Comando que ejecuta el método checkFileOrDir() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js check --path="src/dana"
 *  node dist/ejercicio4/appWrapper.js check --path="src/notes"
 */
yargs.command({
  command: 'check',
  describe: 'Shows if it is a directory or a file',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const programa = new Wrapper(argv.path);
      programa.checkFileOrDir();
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método mkdir() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js mkdir --path="pruebita2"
 */
yargs.command({
  command: 'mkdir',
  describe: 'Create a new directory from the path',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const programa = new Wrapper(argv.path);
      programa.mkdir();
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método lsDir() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js list --path="src"
 */
yargs.command({
  command: 'list',
  describe: 'List files in a directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const programa = new Wrapper(argv.path);
      programa.lsDir();
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método catFile() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js cat --path="src/ejercicio2/" --file="prueba.txt"
 *  node dist/ejercicio4/appWrapper.js cat --path="src/notes/" --file="Red note.json"
 */
yargs.command({
  command: 'cat',
  describe: 'Show the content of a file',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
    file: {
      describe: 'File',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.file === 'string') {
      const programa = new Wrapper(argv.path);
      programa.catFile(argv.file);
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método remove() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js rm --path="src/notes/" --fileDir="dana/"
 *  node dist/ejercicio4/appWrapper.js rm --path="src/notes/dana/" --fileDir="Yellow note.json"
 */
yargs.command({
  command: 'rm',
  describe: 'Delete files and directories',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
    fileDir: {
      describe: 'file or directory to delete',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.fileDir === 'string') {
      const programa = new Wrapper(argv.path);
      programa.remove(argv.fileDir);
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método move() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js move --path="src/ejercicio4/" --pathNew="src/notes" --file="prueba.txt"
 *  node dist/ejercicio4/appWrapper.js move --path="src/notes/" --pathNew="src/ejercicio4" --file="dana"
 */
yargs.command({
  command: 'move',
  describe: 'Move the content passed by parameter to the new path',
  builder: {
    path: {
      describe: 'old path',
      demandOption: true,
      type: 'string',
    },
    pathNew: {
      describe: 'new path',
      demandOption: true,
      type: 'string',
    },
    file: {
      describe: 'thing to move',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.pathNew === 'string' && typeof argv.file === 'string') {
      const programa = new Wrapper(argv.path);
      programa.move(argv.pathNew, argv.file);
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});


/**
 * Comando que ejecuta el método copy() de Wrapper
 * Ejemplo de ejecución:
 *  node dist/ejercicio4/appWrapper.js cp --path="src/ejercicio4/" --pathNew="src/notes" --file="prueba.txt"
 *  node dist/ejercicio4/appWrapper.js cp --path="src/notes/" --pathNew="src/ejercicio4" --file="dana"
 */
yargs.command({
  command: 'cp',
  describe: 'Copy the content passed by parameter to the new path',
  builder: {
    path: {
      describe: 'old path',
      demandOption: true,
      type: 'string',
    },
    pathNew: {
      describe: 'new path',
      demandOption: true,
      type: 'string',
    },
    file: {
      describe: 'thing to copy',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.pathNew === 'string' && typeof argv.file === 'string') {
      const programa = new Wrapper(argv.path);
      programa.copy(argv.pathNew, argv.file);
    } else {
      console.log(chalk.red('Error: Invalid arguments'));
    }
  },
});

yargs.parse();
