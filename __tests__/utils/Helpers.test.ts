import {
  convertObjectNumberValuesToFraction,
  ensureInteger,
  filterSortLimitObjectByValues,
  fractionToPercentage,
  getRandomColor,
  invertColor,
  S4,
  urlPattern,
} from '@/utils/Helpers';

describe('S4', () => {
  it('should return a string of length 4', () => {
    const target = S4();
    expect(typeof target).toBe('string');
    expect(target.length).toBe(4);
  });

  it('should return a string that is a valid hexadecimal number', () => {
    expect(S4()).toMatch(/^[0-9a-f]+$/);
  });
});

describe('getRandomColor', () => {
  it('should return a string that is a valid hexadecimal color', () => {
    expect(getRandomColor()).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('invertColor', () => {
  it('should return #000000 when the color is light', () => {
    expect(invertColor('#FFFFFF')).toBe('#000000');
  });

  it('should return #FFFFFF when the color is dark', () => {
    expect(invertColor('#000000')).toBe('#FFFFFF');
  });
});

describe('urlPattern', () => {
  it('should match a valid URL', () => {
    expect('https://www.google.com').toMatch(urlPattern);
    expect('google.com').toMatch(urlPattern);
  });

  it('should not match an invalid URL', () => {
    expect('google').not.toMatch(urlPattern);
  });
});

describe('ensureInteger', () => {
  it('should return a number when given a number', () => {
    expect(ensureInteger(1)).toBe(1);
  });

  it('should return a number when given a string', () => {
    expect(ensureInteger('123')).toBe(123);
  });

  it('should return a default number when given an invalid value', () => {
    expect(ensureInteger('a', 2)).toBe(2);
  });
});

describe('filterSortLimitObjectByValues', () => {
  it('should return an object with the correct properties', () => {
    const target = {
      a: 1,
      b: 2,
      d: 4,
      c: 3,
      e: 5,
    };
    expect(
      filterSortLimitObjectByValues(
        target,
        (v) => v >= 2,
        (a, b) => b - a,
        2
      )
    ).toEqual({
      d: 4,
      e: 5,
    });
  });
});

describe('convertObjectNumberValuesToFraction', () => {
  it('should return an object with the correct properties', () => {
    expect(convertObjectNumberValuesToFraction({ a: 1, b: 3 })).toEqual({
      a: 0.25,
      b: 0.75,
    });
  });
});

describe('fractionToPercentage', () => {
  it('should return a string with 1 decimal place', () => {
    expect(fractionToPercentage(0.5)).toBe('50.0%');
  });
});
