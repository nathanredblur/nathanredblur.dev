import { Font } from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Mirrored from `src/config.ts` → `siteConfig.themeColor.hue`. We do NOT import
// from src/config because src/types/config.ts uses the `@constants/constants`
// tsconfig path alias, which tsx does not resolve by default. If the site hue
// changes, update this constant.
const themeHue = 300;

const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const fontDir = path.join(thisDir, "fonts");
const publicDir = path.resolve(thisDir, "..", "..", "public");

Font.register({
	family: "Roboto",
	fonts: [
		{ src: path.join(fontDir, "Roboto-Regular.ttf") },
		{ src: path.join(fontDir, "Roboto-Bold.ttf"), fontWeight: "bold" },
		{ src: path.join(fontDir, "Roboto-Italic.ttf"), fontStyle: "italic" },
	],
});

export const publicAsset = (webPath: string): string =>
	path.join(publicDir, webPath.replace(/^\//, ""));

const hueToHex = (hue: number, saturation = 70, lightness = 45): string => {
	const s = saturation / 100;
	const l = lightness / 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = l - c / 2;
	const [r1, g1, b1] =
		hue < 60
			? [c, x, 0]
			: hue < 120
				? [x, c, 0]
				: hue < 180
					? [0, c, x]
					: hue < 240
						? [0, x, c]
						: hue < 300
							? [x, 0, c]
							: [c, 0, x];
	const toByte = (v: number) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toByte(r1)}${toByte(g1)}${toByte(b1)}`;
};

export const modernAccent = hueToHex(themeHue);

export const classicTheme = {
	accent: "#29B6F6",
	sidebarBg: "#E8F1F6",
	text: "#1A1A1A",
	muted: "#555555",
	font: "Roboto",
} as const;

export const modernTheme = {
	accent: modernAccent,
	text: "#111111",
	muted: "#555555",
	subtle: "#BBBBBB",
	font: "Roboto",
} as const;

export const atsTheme = {
	text: "#000000",
	muted: "#333333",
	font: "Helvetica",
} as const;
