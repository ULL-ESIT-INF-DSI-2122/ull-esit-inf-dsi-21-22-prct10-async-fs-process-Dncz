import 'mocha';
import {expect} from 'chai';
import {Note} from '../../src/ejercicio3/note';

describe('Test de la clase Nota', () => {
  const nota = new Note("Blue Note", "blue", "Esto es una nota azul");
  it('Existe el método getNombre()', () => {
    expect(nota.getName).to.exist;
    expect(nota.getName).to.be.a('function');
    expect(nota.getName()).to.be.equal('Blue Note');
  });

  it('Existe el método getColor()', () => {
    expect(nota.getColor).to.exist;
    expect(nota.getColor).to.be.a('function');
    expect(nota.getColor()).to.be.equal('blue');
  });

  it('Existe el método getCuerpo()', () => {
    expect(nota.getBody).to.exist;
    expect(nota.getBody).to.be.a('function');
    expect(nota.getBody()).to.be.equal('Esto es una nota azul');
  });
});
