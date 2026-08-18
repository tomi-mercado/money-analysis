const palette = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#ede9fe", "#cffafe", "#ffedd5", "#e0e7ff", "#d1fae5", "#fee2e2"];

export function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
}

export function colorFromSeed(seed: string) {
  let hash = 0;
  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return palette[hash % palette.length];
}

export function getBackgroundColor(color: string | undefined, seed: string) {
  return color || colorFromSeed(seed);
}

export function getTextColor(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "");
  if (hex.length !== 6) {
    return "#17202a";
  }

  const channels = [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const luminance = channels.reduce((sum, channel, index) => sum + (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > 0.42 ? "#17202a" : "#ffffff";
}
