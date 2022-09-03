import { Pokemon } from '@/models/Pokemon';

export class PokePaste {
  author: string;

  notes: string;

  paste: string;

  title: string;

  constructor({ author, notes, paste, title }: { author: string; notes: string; paste: string; title: string }) {
    this.author = author;
    this.notes = notes;
    this.paste = paste;
    this.title = title;
  }

  extractPokemonFromPaste(): Pokemon[] | undefined {
    return Pokemon.convertPasteToTeam(this.paste);
  }
}
