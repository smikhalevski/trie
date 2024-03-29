import { Trie } from './types';
import { getCharCodeAt } from './utils';

/**
 * Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`,
 * and returns the corresponding leaf.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 * setValue(trie, 'foobar', 222);
 *
 * search(trie, '___foobar___', 3);
 * // ⮕ Trie { key: 'foobar', value: 222, length: 6 }
 *
 * search(trie, '___fooba___', 3);
 * // ⮕ Trie { key: 'foo', value: 111, length: 3 }
 * ```
 *
 * @param trie The trie root.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns A leaf in the trie or `null` if there's no matching key.
 * @template Value The value stored in a trie.
 */
export const search = createSearch();

/**
 * Creates a function that searches the trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 * @see {@link search}
 */
export function createSearch(charCodeAt = getCharCodeAt) {
  return (
    /**
     * Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`,
     * and returns the corresponding leaf.
     *
     * @param trie The trie root.
     * @param input The string to search for the key from the `trie`.
     * @param startIndex The index in `input` to start reading substring from.
     * @param endIndex The index in `input` to stop reading.
     * @returns A leaf in the trie or `null` if there's no matching key.
     * @template Value The value stored in a trie.
     */
    <Value>(trie: Trie<Value>, input: string, startIndex = 0, endIndex = input.length): Trie<Value> | null => {
      let leaf: Trie<Value> | null = null;
      let i = startIndex;

      while (i < endIndex) {
        if (trie.last !== null) {
          if (trie.isLeaf) {
            leaf = trie;
          }

          const child = trie[charCodeAt(input, i)];
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
          while (j < trieLeafCharCodesLength && charCodeAt(input, i) === trieLeafCharCodes[j]) {
            ++j;
            ++i;
          }
          if (j === trieLeafCharCodesLength) {
            return trie;
          }
          return leaf;
        }
      }

      if (i === endIndex && trie.isLeaf && trie.leafCharCodes === null) {
        return trie;
      }
      return leaf;
    }
  );
}
