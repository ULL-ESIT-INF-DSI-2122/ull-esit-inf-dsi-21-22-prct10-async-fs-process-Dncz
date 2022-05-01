import chalk from 'chalk';
import * as yargs from 'yargs';
import {Note} from './note';
import {User} from './user';


/**
 * Comando que permite añadir una nota
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Content of the note',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color used to print the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const nota = new Note(argv.title, argv.color, argv.body);
      const user = new User(argv.user);
      if (user.checkColor(argv.color)) {
        user.addNote(nota);
      } else {
        console.log(chalk.red("Color inválido"));
      }
    } else {
      console.log(chalk.red("Error: Argumentos inválidos"));
    }
  },
});

/**
 * Comando para elimnar una nota
 */
yargs.command({
  command: 'remove',
  describe: 'remove a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      const user = new User(argv.user);
      user.deleteNote(argv.title);
    } else {
      console.log(chalk.red("Error: insuficiente argumentos"));
    }
  },
});

/**
 * Comando para modificar una nota
 */
yargs.command({
  command: 'modify',
  describe: 'Modify a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color used to print the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Content of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const nota = new Note(argv.title, argv.color, argv.body);
      const user = new User(argv.user);
      if (user.checkColor(argv.color)) {
        user.modifyNote(nota);
      } else {
        console.log(chalk.red("Color inválido"));
      }
    }
  },
});

/**
 * Comando para listar una nota del usuario
 */
yargs.command({
  command: 'list',
  describe: 'List a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const usuario = new User(argv.user);
      usuario.listNotes();
    }
  },
});

/**
 * Comando para leer una nota
 */
yargs.command({
  command: 'read',
  describe: 'Read a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      const usuario = new User(argv.user);
      usuario.readNote(argv.title);
    }
  },
});


yargs.parse();
