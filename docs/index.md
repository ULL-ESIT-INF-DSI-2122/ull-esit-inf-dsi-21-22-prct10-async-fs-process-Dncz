# Práctica 10 - Sistema de ficheros y creación de procesos en Node.js
### [Git Pages](https://ull-esit-inf-dsi-2122.github.io/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz/).

## Índice
- [Introducción](#id1)
- [Ejercicios](#id2)
  - [Ejercicio 1](#id3)
  - [Ejercicio 2](#id4)
  <!-- - [Ejercicio 3](#id5) -->
  - [Ejercicio 4](#id6)
- [Referencias](#id7)


## Introducción <a name="id1"></a>
En esta práctica se resolverán los ejercicios propuestos, haciendo uso de la API de Node.js para interactuar con el sistema de ficheros, así como para crear procesos.
Para interactuar con la aplicación a través de las líneas de comandos, utlizaremos los módulos yars. Así mismo, para mostrar los mensaje informativos de un color, trabajaremos con el paquete chalk.

## Ejercicios <a name="id2"></a>
### Ejercicio 1 <a name="id3"></a>
A continuación, dada el [siguiente código](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz/blob/4339096d838c8e81c9f89d27c2861726ed3dbe49/src/ejercicio1/ejercicio1.ts), realizaremos la traza de ejecución de la pila de llamadas, la API y la cola.

Se inicializan la pila de llamadas, la API y la cola vacías.
| Pila de llamadas   |     API     |     Cola      |
|-------------------|-------------|---------------|
|   |   |   |

Si la primera condición se cumple, entra el console.log(...) a la pila llamada y después sale de ella imprimiéndose por consola. Finalizando el programa. En caso contrario, el método access entra en la pila de llamada.
| Pila de llamadas   |     API     |     Cola      |
|-------------------|-------------|---------------|
| access(...)  |   |   |
| (err) => {}  |   |   |

Luego, dicha función pasa a la API y después a la cola. Como la pila de llamada se encutra vacía, los procesos de la cola pueden pasar a la pila de llamadas.
Si tuvieramos un err, (err) => {}, se imprime por consola `File ${filename} does not exist` y acabaría el programa. En caso contrario, se imprime por pantalla `Starting to watch file ${filename}` y se crea el objeto FSWatcher, watcher.
| Pila de llamadas   |     API     |     Cola      |
|--------------------|-------------|---------------|
| watcher.on('change', () => {}  |   |   |

Cuando se active un evento que detecta el cambio, _change_, la función pasará a la API y se imprimirá por pantalla `File ${filename} has been modified somehow`. Y se quedará esperando hasta que se produzca otro cambio.
| Pila de llamadas   |     API     |     Cola      |
|--------------------|-------------|---------------|
|  | watcher.on  |   |


### Ejercicio 2 <a name="id4"></a>
En la clase _ComandCatAndGrep_, definida en el fichero [ejercicio2.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz/blob/c6c5663156628a79dae7cde3135e23feee42f9ad/src/ejercicio2/ejercicio2.ts), se implementará el programa que devuelve el número de ocurrencias de una palabra de un fichero de texto. Para acceder al contenido del fichero expandimos el comando cat y el comando grep con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.

El ejercicio se resolverá de dos maneras:
  - __Utilizando subprocesos__.
    ```typescript
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
    ```
    Con los métodos de fs, utlizaremos _watch_ para observar los cambios que se produzcan en el fichero. Si el evento es _change_, indica que se ha produce un cambio y ejecuta el proceso de conteo de ocurrencias que se ha definido. Pero, si se produce el evento _rename_, indica que el fichero se ha eliminado inesperadamente.
    Para resolver el ejecicio, se ha creado dos procesos: cat y grep. Cuando el childProcess de cat emita un evento de tipo _data_, se escribe el contenido del buffer apuntado por _dataCommandCat_ al stream del proceso childProcess de grep. Por otro lado, cuando el childProcess de grep emita el evento tipo data, en _comandoOut_ guardaremos los datos leídos desde el stream. Después, el childProcess de grep emitirá otro evento, _close_, utilizamos el método find() para el conteo de ocurrencias del contenido del fichero.
    
    Función __Find__.
    ```typescript
    public find(phrase: string[], word: string): number {
      let found: number = 0;
      phrase.forEach((word1) => {
        if (word == word1) {
          found++;
        }
      });
      return found;
    }
    ```
    #### Ejecución utilizando subprocesos
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio2/ejercicio2.js src/ejercicio2/prueba.txt ocurrencias
    Execution without pipe
    Cuente el número de ocurrencias de dicha palabra en las líneas obtenidas
    En caso de no encontrar ocurrencias muestre un mensaje informativo de lo anterior.

    Numbers of occurrences of the word ocurrencias: 2
    Cuente el número de ocurrencias de dicha palabra en las líneas obtenidas
    En caso de no encontrar ocurrencias muestre un mensaje informativo de lo anterior.

    Numbers of occurrences of the word ocurrencias: 2
    ```
  - __Utilizando del método pipe__.
    ```typescript
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
    ```
    El esquema se repite como el anterior método, sin embargo en esta función se utiliza el método pipe para redirigir la salida del comando cat al comando grep.
    #### Ejecución con el método pipe.
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio2/ejercicio2.js src/ejercicio2/prueba.txt pipe ocurrencias
    Execution with pipe
    Numbers of occurrences of the word ocurrencias: 2
    Cuente el número de ocurrencias de dicha palabra en las líneas obtenidas
    En caso de no encontrar ocurrencias muestre un mensaje informativo de lo anterior
    Numbers of occurrences of the word ocurrencias: 2
    Cuente el número de ocurrencias de dicha palabra en las líneas obtenidas
    En caso de no encontrar ocurrencias muestre un mensaje informativo de lo anterior
    ```
#### En caso de que el fichero no exista el fichero.
```bash
[~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio2/ejercicio2.js src/ejercicio2/prueba2.txt ocurrencias
src/ejercicio2/prueba2.txt does not exist
```


<!-- ### Ejercicio 3 <a name="id5"></a> -->


### Ejercicio 4 <a name="id6"></a>
- **appWrapper**
  Se desarrolla un programa usando el módulo yargs que nos permite hacer el wrapper entre los diferentes comandos Unix/Linux.
- **Clase Wrapper**

  En la clase _Wrapper_, definida en el fichero [wrapper.ts](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz/blob/c6c5663156628a79dae7cde3135e23feee42f9ad/src/ejercicio4/wrapper.ts), contendrá un atributo privado que será la ruta.
  
  En la clase, se implementan los métodos necesarios:
  - __checkFileOrDir__: comprueba que la ruta es un directorio o un fichero. En la función, se comprueba que la ruta existe. Luego, utilizamos el método _lstat_ de fs que nos debolverá información sobre la ruta (_stats_). Comprobamos que la información es un fichero, _isFile()_, o un directorio, _isDirectory()_, y se mostrará en la consola.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js check --path="src/dana"
    Error: ENOENT: no such file or directory, access 'src/dana'
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js check --path="src/notes"
    src/notes is a directory
    ```

  - __mkdir__: crea un nuevo directorio a partir de la ruta, para ello utilizaremos _mkdir()_.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js mkdir --path="pruebita2"
    The file has been created successfully
    ```

  - __lsDir__: lista el contenido de un directorio. Usaremos la función _readdir()_, la cuál devolverá un array con el contenido del directorio.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js list --path="src"
    ejercicio1
    ejercicio2
    ejercicio3
    ejercicio4
    modificacion
    notes
    prueba.ts
    ```

  - __catFile__: muestra el contenido del fichero. Emplearemos la función _readFile()_ para leer el fichero de la ruta. Luego, se muestra el contenido del fichero contenido en el bufer _data_.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js cat --path="src/ejercicio2/" --file="prueba.txt"
    Cuente el número de ocurrencias de dicha palabra en las líneas obtenidas
    haciendo uso de una expresión regular y muéstrelas por la consola.
    En caso de no encontrar ocurrencias muestre un mensaje informativo de lo anterior.

    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js cat --path="src/notes/" --file="Red note.json"
    src/notes/Red note.json does not exist
    ```

  - __remove__: borra el contenido de un directorio o fichero concreto. En este ejercicio, podemos emplear la función _rm()_ o bien utilizar _spawn()_ con el comando `rm -r` de Unix/Linux. En lo personal, para practicar, emplee la segunda opción con el método pipe. Creamos el childProcess para el comando rm y, usando pipe, redirigimos la salida estándar (rmChild.stdout) del proceso hijo a la salida estándar del proceso de nuestro programa (process.stdout).
    ```typescript
    public remove(thingToDelete: string) {
      const path2 = this.path + thingToDelete;
      access(path2, constants.F_OK, (err) => {
        if (err) {
          console.log(chalk.red(path2 + ' does not exist'));
        } else {
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js rm --path="src/notes/dana/" --fileDir="Yellow note.json"
    Yellow note.json has been successfully removed

    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js rm --path="src/notes/" --fileDir="Dana/"
    Dana/ has been successfully removed
    ```

  - __move__: mueve el contenido pasado por parámetro a la nueva ruta., para ello utilizaremos la función _rename()_.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$ls src/ejercicio4/
    appWrapper.ts  prueba.txt  wrapper.ts

    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js move --path="src/notes/" --pathNew="src/ejercicio4" --file="dana"
    Successfully moved

    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$ls src/ejercicio4/
    appWrapper.ts  dana  prueba.txt  wrapper.ts
    ```
  - __copy__: copia el contenido pasado por parámetro a la nueva ruta. Podemos utilizar copyFile(), cp() o spawn(). Sin embargo, la primera opción sirve sólo para ficheros y la segunda no se recomienda debido a que está en modo experimental. Para este ejercicio, utilizaremos la tercera opción con pipe.
    ```typescript
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
    ```
    __Ejecución__
    ```bash
    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js cp --path="src/ejercicio4/" --pathNew="src/notes" --file="prueba.txt"
    Successfully copied

    [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Dncz(main)]$node dist/ejercicio4/appWrapper.js cp --path="src/notes/" --pathNew="src/ejercicio4" --file="dana"
    Successfully copied
    ```

## Referencias <a name="id7"></a>
- [API de callbacks- Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#callback-api)
- [API asíncrona- Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#asynchronous-process-creation)
- [Enunciado](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/)