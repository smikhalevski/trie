import {Trie} from './trie-types';

/**
 * Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends
 * at `endIndex`.
 *
 * @param trie The trie root.
 * @param input The string to search for the key from the `trie`.
 * @param [startIndex = 0] The index in `input` to start reading substring from.
 * @param [endIndex = input.length] The index in `input` to stop reading.
 * @returns A leaf in the trie or `null` if there's no matching key.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSearch<T>(trie: Trie<T>, input: string, startIndex = 0, endIndex = input.length): Trie<T> | null {

  let leaf: Trie<T> | null = null;
  let i = startIndex;

  while (i < endIndex) {

    if (trie.last !== null) {

      if (trie.isLeaf) {
        leaf = trie;
      }

      const child = trie[input.charCodeAt(i)];
      if (child === undefined) {
        break;
      }

      trie = child;
      ++i;

    } else {

      const trieLeafCharCodes = trie.leafCharCodes;
      if (trieLeafCharCodes === null) {
        return trie;
      }

      const trieLeafCharCodesLength = trieLeafCharCodes.length;
      if (i + trieLeafCharCodesLength > endIndex) {
        return leaf;
      }

      let j = 0;
      while (j < trieLeafCharCodesLength && input.charCodeAt(i) === trieLeafCharCodes[j]) {
        ++j;
        ++i;
      }
      return j === trieLeafCharCodesLength ? trie : leaf;
    }
  }

  return i === endIndex && trie.isLeaf && trie.leafCharCodes === null ? trie : leaf;
}
