export const colors = {
  backgroundBase: "#0A080F",
  surface: "#110D17",
  backgroundElevated: "#181220",
  backgroundSpotlight: "#21172C",
  backgroundHover: "#1B1424",
  backgroundActive: "#291637",
  backgroundTag: "#21182C",
  backgroundPrimary: "#21132E",
  backgroundPrimaryHover: "#2B183B",

  textPrimary: "#F5F0FA",
  textSecondary: "#B9AFC2",
  textTertiary: "#82758D",
  textQuaternary: "#5D5266",
  textAccent: "#D8B4FE",
  white: "#FFFFFF",

  borderDefault: "#30243A",
  borderSubtle: "#211A28",
  borderAccent: "#4A2A60",
  borderHover: "#4A3A55",

  primary: "#A855F7",
  primaryDark: "#6D28D9",
  primaryHover: "#C084FC",
  primaryActive: "#9333EA",
  primaryFocus: "#8B5CF6",

  success: "#4ADE80",
  warning: "#FACC15",
  error: "#F43F5E",

  primaryGlowSoft: "rgb(168 85 247 / 12%)",
  primaryGlowSubtle: "rgb(168 85 247 / 14%)",
  primaryGlow: "rgb(168 85 247 / 18%)",
  primaryGlowHover: "rgb(168 85 247 / 22%)",
  primaryGlowStrong: "rgb(168 85 247 / 25%)",
  primaryGlowIntense: "rgb(109 40 217 / 38%)",
  primaryFocusShadow: "0 0 0 2px rgb(168 85 247 / 15%)",
  primaryBorder: "rgb(192 132 252 / 42%)",
  accentBorder: "rgb(216 180 254 / 42%)",
  accentBorderSubtle: "rgb(216 180 254 / 35%)",
} as const;

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function applyColorScheme(): void {
  Object.entries(colors).forEach(([name, value]) => {
    document.documentElement.style.setProperty(`--color-${toKebabCase(name)}`, value);
  });
}
