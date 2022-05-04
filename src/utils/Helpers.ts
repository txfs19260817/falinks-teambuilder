export const S4 = (): string => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise

export const guidGenerator: () => string = () => `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;

// https://gist.github.com/goldhand/70de06a3bdbdb51565878ad1ee37e92b?permalink_comment_id=3621492#gistcomment-3621492
export const convertStylesStringToObject = (stringStyles: string) =>
  stringStyles.split(';').reduce((acc, style) => {
    const colonPosition = style.indexOf(':');

    if (colonPosition === -1) {
      return acc;
    }

    const camelCaseProperty = style
      .substr(0, colonPosition)
      .trim()
      .replace(/^-ms-/, 'ms-')
      .replace(/-./g, (c) => c.substr(1).toUpperCase());
    const value = style.substr(colonPosition + 1).trim();

    return value ? { ...acc, [camelCaseProperty]: value } : acc;
  }, {});
