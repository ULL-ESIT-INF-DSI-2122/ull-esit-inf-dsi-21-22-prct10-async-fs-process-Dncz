import 'mocha';
import {expect} from 'chai';
import {Note} from '../../src/ejercicio3/note';
import {User} from '../../src/ejercicio3/user';

describe('Test de la clase user', () => {
  const nota = new Note("Blue Note", "blue", "Esto es una nota azul");
  const nota2 = new Note("Blue Note", "green", "Esto es una nota verde!");
  const nota3 = new Note("Green Note", "green", "Esto es una nota verde!");
  const user = new User("Dana");
  const user2 = new User("dsi");

  it('Existe el método getUser()', () => {
    expect(user.getUser()).to.exist;
    expect(user.getUser).to.be.a('function');
    expect(user.getUser()).to.be.equal('Dana');
  });

  it('Existe el método addNote()', () => {
    expect(user.addNote).to.exist;
    expect(user.addNote).to.be.a('function');
    expect(user.addNote(nota)).to.be.equal(undefined);
    expect(user.addNote(nota)).to.be.equal(undefined);
  });

  it('Existe el método readNote()', () => {
    expect(user.readNote).to.exist;
    expect(user.readNote).to.be.a('function');
    expect(user.readNote(nota.getName())).to.be.equal(undefined);
    expect(user.readNote("prueba.json")).to.be.equal(undefined);
    expect(user2.readNote(nota.getName())).to.be.equal(undefined);
  });

  it('Existe el método listNotes()', () => {
    expect(user.listNotes).to.exist;
    expect(user.listNotes).to.be.a('function');
    expect(user.listNotes()).to.be.equal(undefined);
    expect(user2.listNotes()).to.be.equal(undefined);
  });

  it('Existe el método modifyNote()', () => {
    expect(user.modifyNote).to.exist;
    expect(user.modifyNote).to.be.a('function');
    expect(user.modifyNote(nota2)).to.be.equal(undefined);
    expect(user.modifyNote(nota3)).to.be.equal(undefined);
    expect(user2.modifyNote(nota)).to.be.equal(undefined);
  });

  it('Existe el método deleteNote()', () => {
    expect(user.deleteNote).to.exist;
    expect(user.deleteNote).to.be.a('function');
    expect(user.deleteNote(nota.getName())).to.be.equal(undefined);
    expect(user.deleteNote("prueba.json")).to.be.equal(undefined);
    expect(user2.deleteNote(nota.getName())).to.be.equal(undefined);
  });

  it('Existe el método printPartOfNoteByColor()', () => {
    expect(user.printPartOfNoteByColor).to.exist;
    expect(user.printPartOfNoteByColor).to.be.a('function');
    expect(user.printPartOfNoteByColor(nota.getName(), 'blue')).to.be.equal(undefined);
    expect(user.printPartOfNoteByColor(nota.getName(), 'yellow')).to.be.equal(undefined);
    expect(user.printPartOfNoteByColor(nota.getName(), 'red')).to.be.equal(undefined);
    expect(user.printPartOfNoteByColor(nota.getName(), 'green')).to.be.equal(undefined);
  });

  it('Existe el método checkColor()', () => {
    expect(user.checkColor).to.exist;
    expect(user.checkColor).to.be.a('function');
    expect(user.checkColor('blue')).to.be.equal(true);
    expect(user.checkColor('pink')).to.be.equal(false);
  });
});
