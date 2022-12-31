/* eslint-disable no-restricted-syntax, no-await-in-loop */
import type { Args, KWArgs, PokemonIdent } from '@pkmn/protocol';
import { Protocol } from '@pkmn/protocol';

import { urlPattern } from '@/utils/Helpers';

type ReplayResponse = {
  id: string;
  p1: string;
  p2: string;
  format: string;
  log: string;
  uploadtime: number;
  views: number;
  p1id: string;
  p2id: string;
  formatid: string;
  rating: number;
  private: 0 | 1;
  password: string | null;
};

class Replay implements Protocol.Handler {
  // Pokémon Showdown replay JSON URL
  url: string;

  // Game rating
  rating: number;

  // Format
  format: string;

  // Upload time
  timestamp: number;

  // Parsed replay data
  players: Record<
    'p1' | 'p2',
    {
      alt: string;
      ratingBefore: number;
      ratingAfter: number;
      team: string[];
      switchIns: string[];
      moves: {
        name: string;
        turn: number;
      }[];
      terastallize: {
        species: string;
        type: string;
        turn: number;
      };
      win: boolean;
    }
  >;

  constructor(urlOrId: string) {
    this.url = urlPattern.test(urlOrId) ? urlOrId : `https://replay.pokemonshowdown.com/${urlOrId}.json`;
    this.format = '';
    this.timestamp = 0;
    this.rating = 0;
    const initialPlayer = {
      alt: '',
      ratingBefore: 0,
      ratingAfter: 0,
      team: [],
      switchIns: [],
      moves: [],
      terastallize: {
        species: '',
        type: '',
        turn: 0,
      },
      win: false,
    };
    this.players = {
      p1: structuredClone(initialPlayer),
      p2: structuredClone(initialPlayer),
    };
  }

  public populateReplay(): Promise<void> {
    return fetch(this.url)
      .then((r) => r.json())
      .then(({ log, format, uploadtime, rating }: ReplayResponse) => {
        this.format = format;
        this.timestamp = uploadtime;
        this.rating = rating;
        let currentTurn = 0;
        // @ts-ignore
        for (const { args, kwArgs } of Protocol.parse(log)) {
          currentTurn = args[0] === 'turn' ? +args[1] : currentTurn;
          this['|player|'](args);
          this['|poke|'](args);
          this['|switch|'](args, kwArgs);
          this['|move|'](args, kwArgs, currentTurn);
          this['|-terastallize|'](args, currentTurn);
          this['|win|'](args);
        }
      });
  }

  '|player|'(args: Args['|player|']) {
    if (args[0] === 'player') {
      const [, player, name, , rating] = args;
      this.players[player === 'p1' ? 'p1' : 'p2'] = {
        ...this.players[player === 'p1' ? 'p1' : 'p2'],
        alt: name || player,
        ratingBefore: +(rating || 0),
      };
    }
  }

  '|poke|'(args: Args['|poke|']) {
    if (args[0] === 'poke') {
      const [, player, details] = args;
      const { speciesForme } = Protocol.parseDetails('', '' as PokemonIdent, details);
      this.players[player === 'p1' ? 'p1' : 'p2'].team.push(speciesForme);
    }
  }

  '|switch|'(args: Args['|switch|'] | Args['|drag|'] | Args['|replace|'], _: KWArgs['|switch|']) {
    if (args[0] === 'switch' || args[0] === 'drag' || args[0] === 'replace') {
      const [, ident, details] = args;
      const { player } = Protocol.parsePokemonIdent(ident);
      const { speciesForme } = Protocol.parseDetails('', ident, details);
      this.players[player === 'p1' ? 'p1' : 'p2'].switchIns.push(speciesForme);
    }
  }

  '|move|'(args: Args['|move|'], _: KWArgs['|move|'], turn = 0) {
    if (args[0] === 'move') {
      const [, ident, move] = args;
      const { player } = Protocol.parsePokemonIdent(ident);
      this.players[player === 'p1' ? 'p1' : 'p2'].moves.push({
        name: move,
        turn,
      });
    }
  }

  '|-terastallize|'(args: Args['|-terastallize|'], turn = 0) {
    if (args[0] === '-terastallize') {
      const [, ident, typename] = args;
      const { player, name } = Protocol.parsePokemonIdent(ident);
      this.players[player === 'p1' ? 'p1' : 'p2'].terastallize = {
        species: name,
        type: typename,
        turn,
      };
    }
  }

  '|win|'(args: Args['|win|'] | Args['|raw|']) {
    if (args[0] === 'win') {
      const [, winnerAlt] = args as Args['|win|'];
      this.players.p1.win = this.players.p1.alt === winnerAlt;
      this.players.p2.win = !this.players.p1.win;
    } else if (args[0] === 'raw') {
      const [, htmlString] = args as Args['|raw|'];
      // Parse username, rating before, rating after from HTML string like this:
      // "19402u's rating: 1693 &rarr; <strong>1711</strong><br />(+18 for winning)\n"
      const regex = /(\w+)'s rating: (\d+) &rarr; <strong>(\d+)<\/strong><br \/>\((\+|-)\d+ for (winning|losing)\)/g;
      const match = regex.exec(htmlString);
      if (match) {
        const [, alt, ratingBefore, ratingAfter] = match;
        const player = alt === this.players.p1.alt ? 'p1' : 'p2';
        this.players[player] = {
          ...this.players[player],
          ratingBefore: +(ratingBefore || this.players[player].ratingBefore),
          ratingAfter: +(ratingAfter || this.players[player].ratingAfter),
        };
      }
    }
  }

  get leads(): Record<'p1' | 'p2', string[]> {
    const leads: Record<'p1' | 'p2', string[]> = {
      p1: [],
      p2: [],
    };
    (['p1', 'p2'] as const).forEach((player) => {
      const { switchIns } = this.players[player];
      leads[player] = [switchIns[0]!, switchIns[1]!];
    });
    return leads;
  }

  get bringIns(): Record<'p1' | 'p2', string[]> {
    const bringIns: Record<'p1' | 'p2', string[]> = {
      p1: [],
      p2: [],
    };
    (['p1', 'p2'] as const).forEach((player) => {
      const { switchIns } = this.players[player];
      bringIns[player] = Array.from(new Set(switchIns));
    });
    return bringIns;
  }

  get switchTimes(): Record<'p1' | 'p2', number> {
    return {
      p1: this.players.p1.switchIns.length,
      p2: this.players.p2.switchIns.length,
    };
  }

  get ProtectTimes(): Record<'p1' | 'p2', number> {
    return {
      p1: this.players.p1.moves.filter(({ name }) => name === 'Protect').length,
      p2: this.players.p2.moves.filter(({ name }) => name === 'Protect').length,
    };
  }
}

export default Replay;
