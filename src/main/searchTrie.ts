import {Trie} from './trie-types';

/**
 * Searches for a leaf trie that describes the longest substring from `input` starting at `offset`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The offset in `input` to start reading substring from.
 * @param endIndex The maximum key length that is searched. If `undefined` then unlimited.
 * @returns A leaf in the trie or `undefined` if there's no matching key in the `trie`.
 */
export function searchTrie<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length): Trie<T> | undefined {

  let leafTrie: Trie<T> | undefined;

  search: for (let i = startIndex; i < endIndex; ++i) {

    if (trie.isLeaf) {
      const leafCharCodes = trie.leafCharCodes;

      if (leafCharCodes !== null) {
        const leafCharCodesLength = leafCharCodes.length;

        if (i + leafCharCodesLength > endIndex) {
          break;
        }
        for (let j = 0; j < leafCharCodesLength; ++i, ++j) {
          if (input.charCodeAt(i) !== leafCharCodes[j]) {
            // leafCharCodes and nextCharCodes are mutually exclusive
            break search;
          }
        }

        // Matched a leaf with leafCharCodes
        leafTrie = trie;
        break;
      }

      // Matched a leaf without leafCharCodes, must check next tries
      leafTrie = trie;
    }

    const next = trie.next;
    if (next === null) {
      break;
    }

    const nextCharCodes = trie.nextCharCodes!;
    const charCode = input.charCodeAt(i);

    let j = -1;
    let m = 0;
    let n = nextCharCodes.length - 1;

    // Binary search of a char code index in next
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

    trie = next[j];
  }

  if (leafTrie === undefined && trie.isLeaf) {
    return trie;
  }

  return leafTrie;
}
