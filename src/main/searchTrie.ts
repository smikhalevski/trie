import {Trie} from './trie-types';

/**
 * Searches for a leaf trie that describes the longest substring from `str` starting at `offset`.
 *
 * @param trie The trie to search in.
 * @param str The string to search for the key from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A leaf in the trie or `undefined` if there's no matching key in the `trie`.
 */
export function searchTrie<T>(trie: Trie<T>, str: string, offset: number): Trie<T> | undefined {

  const strLength = str.length;

  if (strLength === 0 && trie.isLeaf && trie.key!.length === 0) {
    return trie;
  }

  let leafTrie: Trie<T> | undefined;

  strLoop: for (let i = offset; i < strLength; ++i) {

    const leafCharCodes = trie.leafCharCodes;

    if (leafCharCodes !== null) {
      const leafCharCodesLength = leafCharCodes.length;

      if (i + leafCharCodesLength > strLength) {
        break;
      }
      for (let j = 0; j < leafCharCodesLength; ++i, ++j) {
        if (str.charCodeAt(i) !== leafCharCodes[j]) {
          break strLoop;
        }
      }
      leafTrie = trie;
      break;
    }

    if (trie.isLeaf) {
      leafTrie = trie;
    }

    const next = trie.next;
    if (next === null) {
      break;
    }

    const nextCharCodes = trie.nextCharCodes!;
    const charCode = str.charCodeAt(i);

    let j = -1;
    let m = 0;
    let n = nextCharCodes.length - 1;

    // Binary search of a char code index
    while (m <= n) {
      const k = n + m >> 1;
      const d = nextCharCodes[k] - charCode;

      if (d < 0) {
        m = k + 1;
      } else if (d > 0) {
        n = k - 1;
      } else {
        j = k;
        break;
      }
    }

    if (j === -1) {
      break;
    }

    const nextTrie = next[j];
    if (nextTrie.isLeaf && nextTrie.leafCharCodes === null) {
      leafTrie = nextTrie;
    }
    trie = nextTrie;
  }

  return leafTrie;
}
