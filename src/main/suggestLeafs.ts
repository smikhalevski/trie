import { Trie } from './types';
import { getCharCodeAt } from './utils';

/**
 * Returns the cached readonly array of trie leafs that have keys starting with
 * `input.substring(startIndex, endIndex)`.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'hotdog', 111);
 * setValue(trie, 'hotter', 222);
 * setValue(trie, 'hottest', 333);
 *
 * suggestLeafs(trie, 'hot');
 * // ⮕ [Trie { key: 'hotdog' }, Trie { key: 'hotter' }, Trie { key: 'hottest' }]
 *
 * suggestLeafs(trie, 'hott');
 * // ⮕ [Trie { key: 'hotter' }, Trie { key: 'hottest' }]
 *
 * suggestLeafs(trie, 'cold');
 * // ⮕ null
 * ```
 *
 * @param trie The trie root.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The cached readonly array of leafs or `null` if there's no matching key.
 * @template Value The value stored in a trie.
 * @see {@link suggestValues}
 */
export const suggestLeafs = createSuggestLeafs();

/**
 * Creates a function that produces suggestions from a trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 * @see {@link suggest}
 */
export function createSuggestLeafs(charCodeAt = getCharCodeAt) {
  return (
    /**
     * Returns the cached readonly array of trie leafs that have keys starting with
     * `input.substring(startIndex, endIndex)`.
     *
     * @param trie The trie root.
     * @param input The string to search for the key from the `trie`.
     * @param startIndex The index in `input` to start reading substring from.
     * @param endIndex The index in `input` to stop reading.
     * @returns The cached readonly array of leafs or `null` if there's no matching key.
     * @template Value The value stored in a trie.
     */
    <Value>(
      trie: Trie<Value>,
      input: string,
      startIndex = 0,
      endIndex = input.length
    ): readonly Trie<Value>[] | null => {
      let i = startIndex;

      while (i < endIndex) {
        if (trie.last === null) {
          break;
        }

        const child = trie[charCodeAt(input, i)];
        if (child === undefined) {
          break;
        }

        trie = child;
        ++i;
      }

      // Check that there's a sufficient number of characters to satisfy the requested prefix
      if (i !== endIndex) {
        const trieLeafCharCodes = trie.leafCharCodes;
        if (trieLeafCharCodes === null) {
          return null;
        }

        const restLength = endIndex - i;

        const trieLeafCharCodesLength = trieLeafCharCodes.length;
        if (trieLeafCharCodesLength < restLength) {
          return null;
        }

        let j = 0;
        while (j < restLength && charCodeAt(input, i) === trieLeafCharCodes[j]) {
          ++j;
          ++i;
        }
        if (j < restLength) {
          return null;
        }
      }

      const trieSuggestions = trie.suggestions;
      if (trieSuggestions !== null) {
        return trieSuggestions;
      }

      const suggestions: Trie<Value>[] = [];

      if (trie.isLeaf) {
        suggestions.push(trie);
      }

      // Collect leafs
      for (let next = trie.next, last = trie.last; next !== null && last !== null; next = next.next) {
        if (next.isLeaf) {
          suggestions.push(next);
        }
        if (next === last) {
          last = next.last;
        }
      }

      // Populate leafs for ancestors that have only one child
      for (let parent = trie.parent; parent !== null && parent.next === parent.last; parent = parent.parent) {
        parent.suggestions = suggestions;
      }

      trie.suggestions = suggestions;

      return suggestions;
    }
  );
}
