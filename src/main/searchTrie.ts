import {Trie} from './trie-types';

/**
 * Searches for a leaf that describes the longest substring from `input` starting at `offset`.
 *
 * The maximum word length read from the `input` is `endIndex - startIndex`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the word from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @param partial If `false` then the longest matched leaf is returned. Otherwise, the longest matched trie is returned
 * that may not be a leaf.
 * @returns A leaf in the trie or `undefined` if there's no matching word in the `trie`.
 *
 * @template T The type of values stored in a trie.
 */
export function searchTrie<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length, partial = false): Trie<T> | undefined {

  // The longest matched leaf
  let leaf: Trie<T> | undefined;

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
        leaf = trie;
        break;
      }

      // Matched a leaf without leafCharCodes, must check next tries
      leaf = trie;
    }

    const next = trie.next;
    if (next === null) {
      break;
    }

    const nextCharCodes = trie.nextCharCodes!;
    const charCode = input.charCodeAt(i);

    // Binary search for a charCode in nextCharCodes
    let a = 0;
    let b = nextCharCodes.length - 1;

    while (a <= b) {
      const j = b + a >> 1;
      const d = nextCharCodes[j] - charCode;

      if (d < 0) {
        a = j + 1;
      } else if (d > 0) {
        b = j - 1;
      } else {
        trie = next[j];
        continue search;
      }
    }

    // No match
    break;
  }

  if (partial || leaf === undefined && trie.isLeaf && trie.length <= endIndex - startIndex) {
    return trie;
  }

  return leaf;
}
