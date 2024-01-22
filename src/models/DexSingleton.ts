import { Generation, Generations } from '@pkmn/data';
import type { ModdedDex } from '@pkmn/dex';
import { Data, Dex } from '@pkmn/dex';

import { AppConfig } from '@/utils/AppConfig';

class DexSingleton {
  private static instance: DexSingleton; // eslint-disable-line no-use-before-define

  private readonly genNum: number;

  private dex: ModdedDex;

  private gen: Generation;

  private constructor(genNum: number) {
    this.genNum = genNum;
    this.dex = Dex.forGen(this.genNum);
    this.gen = new Generations(Dex, (d: Data) => {
      if (!d.exists) return false;
      if ('isNonstandard' in d && d.isNonstandard) return genNum === 8 ? d.isNonstandard === 'Gigantamax' : false;
      if (d.kind === 'Ability' && d.id === 'noability') return false;
      return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
    }).get(this.genNum);
  }

  public static getDex(gen: number = AppConfig.defaultGen): ModdedDex {
    if (!DexSingleton.instance || DexSingleton.instance.genNum !== gen) {
      DexSingleton.instance = new DexSingleton(gen);
    }
    return DexSingleton.instance.dex;
  }

  public static getGen(gen: number = AppConfig.defaultGen): Generation {
    if (!DexSingleton.instance || DexSingleton.instance.genNum !== gen) {
      DexSingleton.instance = new DexSingleton(gen);
    }
    return DexSingleton.instance.gen;
  }

  public static getGenByFormat(format: string): Generation {
    if (format === 'vgc2014' || format === 'vgc2015') return DexSingleton.getGen(6);
    const genNum = parseInt(format.replace(/gen(\d+).*/, '$1'), 10);
    return DexSingleton.getGen(Number.isNaN(genNum) ? AppConfig.defaultGen : genNum);
  }
}

export default DexSingleton;
