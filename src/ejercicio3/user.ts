import * as fs from 'fs';
import chalk from 'chalk';
import {Note} from "./note";
/**
 * Clase usuario
 */
export class User {
  /**
   * Constructor para un objeto tipo Usuario
   * @param {string} name Nombre del usuario
   */
  constructor(private name: string) {}

  /**
   * Getter del nombre del usuario
   * @returns {string} Nombre
   */
  public getUser(): string {
    return this.name;
  }

  /**
   * Función para añadir una nota
   * @param {Note} newNote Nota a crear y añadir al directorio
   */
  public addNote(newNote: Note) {
    const path: string = './src/notes/' + this.name;
    const file: string = '/' + newNote.getName() + '.json';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true});
    }
    const data = {"title": newNote.getName(), "body": newNote.getBody(), "color": newNote.getColor()};
    if (!fs.existsSync(path + file)) {
      console.log(chalk.green('El fichero se ha creado'));
      fs.writeFileSync(path + file, JSON.stringify(data));
    } else {
      console.log(chalk.red('Error: el fichero ya existe'));
    }
  }


  /**
   * Modifica el contenido del fichero de la nota existente
   * @param {Note} noteToModify Nota con el contenido modificado
   */
  public modifyNote(noteToModify: Note) {
    const path: string = './src/notes/' + this.name;
    const file: string = '/' + noteToModify.getName() + '.json';
    if (fs.existsSync(path)) {
      if (fs.existsSync(path + file)) {
        const data = {"title": noteToModify.getName(), "body": noteToModify.getBody(), "color": noteToModify.getColor()};
        fs.writeFileSync(path + file, JSON.stringify(data));
        console.log(chalk.green("El fichero se ha modificado"));
      } else {
        console.log(chalk.red('Error: el fichero no existe'));
      }
    } else {
      console.log(chalk.red("Error: el directorio no existe"));
    }
  }

  /**
   * función para eliminar una nota del directorio del usario
   * @param {string} titleNote Título de la nota
   */
  public deleteNote(titleNote: string) {
    const path: string = './src/notes/' + this.name;
    const file: string = '/' + titleNote + '.json';
    if (fs.existsSync(path)) {
      if (fs.existsSync(path + file)) {
        fs.rmSync(path + file);
        console.log(chalk.green("Nota eliminada!"));
      } else {
        console.log(chalk.red('Error: el fichero no existe'));
      }
    } else {
      console.log(chalk.red("Error: el directorio no existe"));
    }
  }

  /**
   * Método que muestra la información de la nota
   * @param {string} titleNote Título de la nota a leer y mostrar información
   */
  public readNote(titleNote: string) {
    const path: string = './src/notes/' + this.name;
    const file: string = '/' + titleNote + '.json';
    if (fs.existsSync(path)) {
      if (fs.existsSync(path + file)) {
        const data = JSON.parse(fs.readFileSync(path + file).toString());
        this.printPartOfNoteByColor(data.title, data.color);
        this.printPartOfNoteByColor(data.body, data.color);
        console.log(chalk.green("Nota leida!"));
      } else {
        console.log(chalk.red('Error: el fichero no existe'));
      }
    } else {
      console.log(chalk.red("Error: El directorio no existe"));
    }
  }

  /**
   * Método que muestra los ficheros .json del directorio del usuario
   */
  public listNotes() {
    const path: string = './src/notes/' + this.name;
    if (fs.existsSync(path)) {
      console.log(chalk.white("Tus notas:"));
      const ficheros = fs.readdirSync(path);
      ficheros.forEach((file) => {
        const readFile = fs.readFileSync(path + '/' + file);
        const jsonFichero = JSON.parse(readFile.toString());
        this.printPartOfNoteByColor(jsonFichero.title, jsonFichero.color);
      });
    } else {
      console.log(chalk.red("No existe del directorio"));
    }
  }


  /**
   * Método que muestra por consola el título de la nota
   * con el color correspondiente
   * @param {string} titleNote Título de la nota
   * @param {string} colorNote Color de la nota
   */
  public printPartOfNoteByColor(titleNote: string, colorNote: string) {
    switch (colorNote) {
      case 'blue':
        console.log(chalk.blue.italic(titleNote));
        break;
      case 'yellow':
        console.log(chalk.yellow.italic(titleNote));
        break;
      case 'red':
        console.log(chalk.red.italic(titleNote));
        break;
      case 'green':
        console.log(chalk.green.italic(titleNote));
        break;
    }
  }

  /**
   * Verifica que el color de la nota sea los
   * establecidos de la práctica
   * @param {string} color Color de la nota
   * @returns {boolean} True o False
   */
  public checkColor(color: string): boolean {
    const colorList: string[] = ['red', 'green', 'blue', 'yellow'];
    for (let i = 0; i < colorList.length; i++) {
      if (color == colorList[i]) {
        return true;
      }
    }
    return false;
  }
}
