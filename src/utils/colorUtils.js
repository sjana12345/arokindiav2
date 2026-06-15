const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

const toHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((v) => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');

const darken = (hex, factor) => {
  const [r, g, b] = hexToRgb(hex);
  return toHex(r * factor, g * factor, b * factor);
};

const lighten = (hex, factor) => {
  const [r, g, b] = hexToRgb(hex);
  return toHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
};

export const applyTheme = ({ primary, secondary } = {}) => {
  const root = document.documentElement;
  if (primary) {
    root.style.setProperty('--color-purple-300', lighten(primary, 0.4));
    root.style.setProperty('--color-purple-400', lighten(primary, 0.2));
    root.style.setProperty('--color-purple-500', primary);
    root.style.setProperty('--color-purple-600', darken(primary, 0.87));
    root.style.setProperty('--color-purple-700', darken(primary, 0.75));
  }
  if (secondary) {
    root.style.setProperty('--brand-secondary', secondary);
  }
};
