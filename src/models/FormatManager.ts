import type { Format } from '@/utils/Types';

class FormatManager {
  private readonly formats: Format[];

  constructor() {
    this.formats = [
      {
        id: 'gen9vgc2023regulationc',
        name: '[Gen 9] VGC 2023 Regulation C',
        gen: 9,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Flutter Mane',
        isIndexedAsUsage: true,
        isVGC: true,
      },
      {
        id: 'gen9vgc2023series2',
        name: '[Gen 9] VGC 2023 Series 2',
        gen: 9,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Flutter Mane',
        isIndexedAsUsage: true,
        isVGC: true,
      },
      {
        id: 'gen9vgc2023series1',
        name: '[Gen 9] VGC 2023 Series 1',
        gen: 9,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Gholdengo',
        isIndexedAsUsage: true,
        isVGC: true,
      },
      {
        id: 'gen9battlestadiumsinglesseries2',
        name: '[Gen 9] Battle Stadium Singles Series 2',
        gen: 9,
        gameType: 'singles',
        defaultLevel: 50,
        defaultSpeciesName: 'Gholdengo',
        isIndexedAsUsage: true,
        isVGC: false,
      },
      {
        id: 'gen9battlestadiumsinglesseries1',
        name: '[Gen 9] Battle Stadium Singles Series 1',
        gen: 9,
        gameType: 'singles',
        defaultLevel: 50,
        defaultSpeciesName: 'Gholdengo',
        isIndexedAsUsage: true,
        isVGC: false,
      },
      {
        id: 'gen9doublesou',
        name: '[Gen 9] Doubles OU',
        gen: 9,
        gameType: 'doubles',
        defaultLevel: 100,
        defaultSpeciesName: 'Gholdengo',
        isIndexedAsUsage: true,
        isVGC: false,
      },
      {
        id: 'gen9ou',
        name: '[Gen 9] OU',
        gen: 9,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Gholdengo',
        isIndexedAsUsage: true,
        isVGC: false,
      },
      {
        id: 'gen8vgc2022',
        name: '[Gen 8] VGC 2022',
        gen: 8,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Incineroar',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen1ou',
        name: '[Gen 1] OU',
        gen: 1,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Tauros',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen1uu',
        name: '[Gen 1] UU',
        gen: 1,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Dragonite',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      // gen 2
      {
        id: 'gen2ou',
        name: '[Gen 2] OU',
        gen: 2,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Raikou',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen2uu',
        name: '[Gen 2] UU',
        gen: 2,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Granbull',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      // gen 3
      {
        id: 'gen3ou',
        name: '[Gen 3] OU',
        gen: 3,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Metagross',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen3uu',
        name: '[Gen 3] UU',
        gen: 3,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Altaria',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      // gen 4
      {
        id: 'gen4ou',
        name: '[Gen 4] OU',
        gen: 4,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Heatran',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen4zu',
        name: '[Gen 4] ZU',
        gen: 4,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Probopass',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      // gen 5
      {
        id: 'gen5ou',
        name: '[Gen 5] OU',
        gen: 5,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Jellicent',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      // gen 6
      {
        id: 'gen6ou',
        name: '[Gen 6] OU',
        gen: 6,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Talonflame',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen6uu',
        name: '[Gen 6] UU',
        gen: 6,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Volcanion',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'vgc2014',
        name: '[Gen 6] VGC 2014',
        gen: 6,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Pachirisu',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'vgc2015',
        name: '[Gen 6] VGC 2015',
        gen: 6,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Landorus-Therian',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen6vgc2016',
        name: '[Gen 6] VGC 2016',
        gen: 6,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Xerneas',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen7ou',
        name: '[Gen 7] OU',
        gen: 7,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Tapu Koko',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen7doublesou',
        name: '[Gen 7] Doubles OU',
        gen: 7,
        gameType: 'doubles',
        defaultLevel: 100,
        defaultSpeciesName: 'Incineroar',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen7ubers',
        name: '[Gen 7] Ubers',
        gen: 7,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Yveltal',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen7mixandmega',
        name: '[Gen 7] Mix and Mega',
        gen: 7,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Kartana',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen7vgc2017',
        name: '[Gen 7] VGC 2017',
        gen: 7,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Tapu Fini',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen7vgc2018',
        name: '[Gen 7] VGC 2018',
        gen: 7,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Incineroar',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen7vgc2019ultraseries',
        name: '[Gen 7] VGC 2019 Ultra Series',
        gen: 7,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Incineroar',
        isIndexedAsUsage: false,
        isVGC: true,
      },
      {
        id: 'gen8ou',
        name: '[Gen 8] OU',
        gen: 8,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Dragapult',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8uu',
        name: '[Gen 8] UU',
        gen: 8,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Cobalion',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8doublesou',
        name: '[Gen 8] Doubles OU',
        gen: 8,
        gameType: 'doubles',
        defaultLevel: 100,
        defaultSpeciesName: 'Rillaboom',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8battlestadiumsingles',
        name: '[Gen 8] Battle Stadium Singles',
        gen: 8,
        gameType: 'singles',
        defaultLevel: 50,
        defaultSpeciesName: 'Gastrodon',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8bdspou',
        name: '[Gen 8] BDSP OU',
        gen: 8,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Garchomp',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8nationaldex',
        name: '[Gen 8] National Dex',
        gen: 8,
        gameType: 'singles',
        defaultLevel: 100,
        defaultSpeciesName: 'Ferrothorn',
        isIndexedAsUsage: false,
        isVGC: false,
      },
      {
        id: 'gen8spikemuthcup',
        name: '[Gen 8] Spikemuth Cup',
        gen: 8,
        gameType: 'doubles',
        defaultLevel: 50,
        defaultSpeciesName: 'Incineroar',
        isIndexedAsUsage: false,
        isVGC: false,
      },
    ];
  }

  getFormatById = (formatId: string): Format | undefined => this.formats.find((format) => format.id === formatId);

  /**
   * The default format is the first element in the `formats` array.
   * NOTE: change the rewrite rule in `next.config.js` if the default format is changed
   * @readonly
   */
  get defaultFormat(): Format {
    return this.formats[0]!;
  }

  isDefaultFormatId = (formatId: string): boolean => formatId === this.defaultFormat.id;

  isSupportedFormatId = (formatId: string): boolean => this.formats.some((format) => format.id === formatId);

  private static sorter = (a: Format, b: Format) => {
    // larger gens first
    if (a.gen !== b.gen) return b.gen - a.gen;
    // then singles before doubles
    if (a.gameType !== b.gameType) return a.gameType === 'singles' ? -1 : 1;
    // then non-vgcs before vgcs
    if (a.isVGC !== b.isVGC) return a.isVGC ? 1 : -1;
    // then usage before non-usage
    if (a.isIndexedAsUsage !== b.isIndexedAsUsage) return a.isIndexedAsUsage ? -1 : 1;
    // then alphabetical
    return a.name.localeCompare(b.name);
  };

  getAllFormats = (sorted?: boolean): Format[] => (sorted ? this.formats.sort(FormatManager.sorter) : this.formats);

  get vgcFormats(): Format[] {
    return this.formats.filter((format) => format.isVGC);
  }

  get usageFormats(): Format[] {
    return this.formats.filter((format) => format.isIndexedAsUsage);
  }

  getFormatsByGen = (gen: number): Format[] => this.formats.filter((format) => format.gen === gen);

  /**
   * Group formats by generation
   * @param formats - formats to group, defaults to all formats if not provided
   * @returns An array of arrays of formats, where the first element is an array of formats from the latest generation. Note that it is 1-indexed, so the first element is always undefined.
   */
  groupFormatsByGen: (formats?: Format[]) => Format[][] = (formats) => {
    const groupedFormats: Format[][] = [];
    (formats || this.formats).forEach((format) => {
      if (!groupedFormats[format.gen]) groupedFormats[format.gen] = [];
      groupedFormats[format.gen]!.push(format);
    });
    return groupedFormats.map((fs) => fs.sort(FormatManager.sorter));
  };
}

export default FormatManager;
