/*
 * A color scheme for the application. All non-trivial colors should
 * reference this module (e.g., using 'black' or '#000' is okay, but
 * something like '#ccc' should instead be `Colors.gray.medium`).
 *
 * This module also exports a function `hexWithAlpha` for alpha-adjusted
 * generating CSS color expressions from hex color codes. It is
 * guaranteed that the colors in the default-exported palette will be
 * valid first arguments to `hexWithAlpha`.
 */

/*
 * Note: it's an internal invariant of this file that all colors be
 * represented as six-digit hex codes. (This is needed for
 * `hexWithAlpha` to work with these colors.)
 */
export default {
    primary: '#121316',
    primaryLight: '#2a2d34',
    gray: {
        dark: '#6e6e6e',
        medium: '#cecece',
        light: '#ececec',
        lightest: '#efefef',
    },
    accentBlue: {
        lightest: '#4ca080',
        light: '#2a899b',
        base: '#0a7f96',
        dark: '#046375',
        darkest: '#024d5c',
    },
};

/*
 * Given a hex color string, return a CSS color expression representing
 * the same base color but with the specified alpha value.
 *
 * @param {string} hex
 *     the hex color string, which should contain exactly six
 *     hexadecimal digits (and may contain other stuff, like a leading
 *     hash)
 * @return {string} a CSS color expression
 */
export function hexWithAlpha(hex, alpha) {
    const hexNumber = hex.replace(/[^0-9A-Fa-f]/g, '');
    if (hexNumber.length !== 6) {
        throw new Error(
            `expected string to have exactly six hex digits, but found: ` +
            `${hex}`);
    }
    const r = parseInt(hexNumber.substring(0, 2), 16);
    const g = parseInt(hexNumber.substring(2, 4), 16);
    const b = parseInt(hexNumber.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
