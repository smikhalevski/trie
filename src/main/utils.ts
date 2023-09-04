/**
 * Provide this function is you want to alter the chars that are read from the string on the fly. For example, you can
 * change case or replace chars.
 *
 * @param str The string to read the char from
 * @param index The inder of the char.
 */
export function getCharCodeAt(str: string, index: number): number {
  return str.charCodeAt(index);
}

export const isNaN = Number.isNaN || (value => value !== value);
