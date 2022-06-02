import {Trie} from './trie-types';

/**
 * Searches for a leaf with the key that matches the longest substring from `input` that starts at `startIndex`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns A leaf in the trie or `undefined` if there's no matching key in the `trie`.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSearch<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length): Trie<T> | undefined {

  let leaf: Trie<T> | undefined;
  let i = startIndex;

  while (i < endIndex) {

    // if (trie.nexts !== null) {
    if (trie.hasContinuation) {

      if (trie.isLeaf) {
        leaf = trie;
      }

      const next = trie[input.charCodeAt(i)];
      if (next === undefined) {
        break;
      }

      trie = next;
      ++i;

    } else {

      const leafCharCodes = trie.leafCharCodes;
      if (leafCharCodes === null) {
        return trie;
      }

      const leafCharCodesLength = leafCharCodes.length;
      if (i + leafCharCodesLength > endIndex) {
        return leaf;
      }

      let j = 0;
      while (j < leafCharCodesLength && input.charCodeAt(i) === leafCharCodes[j]) {
        ++j;
        ++i;
      }
      return j === leafCharCodesLength ? trie : leaf;
    }
  }

  return i === endIndex && trie.isLeaf && trie.leafCharCodes === null ? trie : leaf;
}
