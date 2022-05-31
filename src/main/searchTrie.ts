import {Trie} from './trie-types';

/**
 * Finds a leaf with the key that matches the longest substring from `input` that starts at `startIndex`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns A leaf in the trie or `undefined` if there's no matching key in the `trie`.
 *
 * @template T The type of values stored in a trie.
 */
export function searchTrie<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length): Trie<T> | null {

  let leaf: Trie<T> | null = null;
  let i = startIndex;

  while (i < endIndex) {
    const next = trie.next;

    if (next !== null) {
      const nextTrie = next[input.charCodeAt(i)];

      if (trie.isLeaf) {
        leaf = trie;
      }
      if (nextTrie === undefined) {
        break;
      }
      trie = nextTrie;
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
