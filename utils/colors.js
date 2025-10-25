import { TinyColor, mostReadable } from "@ctrl/tinycolor";

function getContrastColor(hexColor) {
    const color = new TinyColor(hexColor);
    const listOfColors = [color.clone().lighten(50), color.clone().darken(50)];
    const contrastColor = mostReadable(hexColor, listOfColors, {
        includeFallbackColors: false,
    });

    // Ensure sufficient contrast
    return contrastColor.toHexString();
}

function isColorLight(hexColor) {
    const color = new TinyColor(hexColor);
    return color.isLight();
}

export { getContrastColor, isColorLight };
