/**
 * Clase nota
 */
export class Note {
  /**
   * Constructor de un objeto Nota
   * @param name Título de la Nota
   * @param color Color de la Nota
   * @param body Contenido de la Nota
   */
  constructor(private name: string, private color: string, private body: string) {}

  /**
   * Getter del título de la nota
   * @returns {string} título
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Getter del color de la nota
   * @returns {string} color
   */
  public getColor(): string {
    return this.color;
  }

  /**
   * Getter del contenido de la nota
   * @returns {string} información almacenada en la nota
   */
  public getBody(): string {
    return this.body;
  }
}
