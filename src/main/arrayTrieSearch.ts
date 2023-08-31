import { ArrayTrie, CharCodeAt } from './types';
import { BRANCH, BRANCH_1, charCodeAt, LEAF } from './utils';

export interface ArrayTrieSearchResult<Value> {
  /**
   * The value that corresponds to the matched key.
   */
  value: Value;

  /**
   * The last index in the input at which the key was successfully matched.
   */
  lastIndex: number;
}

export const arrayTrieSearch = createArrayTrieSearch(charCodeAt);

/**
 * Creates a function that searches the array trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 */
export function createArrayTrieSearch(charCodeAt: CharCodeAt) {
  return (
    /**
     * Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends
     * at `endIndex`.
     *
     * @param trie The array trie.
     * @param input The string to search for the key from the `trie`.
     * @param startIndex The index in `input` to start reading substring from.
     * @param endIndex The index in `input` to stop reading.
     * @param result The in-out parameter, that holds the search result. If omitted, a new object is returned on every call.
     * @returns The `result` object or `null` if there's no matching key.
     * @template Value The value stored in a trie.
     */
    <Value>(
      trie: ArrayTrie<Value>,
      input: string,
      startIndex = 0,
      endIndex = input.length,
      result?: ArrayTrieSearchResult<Value>
    ): ArrayTrieSearchResult<Value> | null => {
      const { nodes, values } = trie;

      let i = startIndex;
      let valueIndex = -1;
      let cursor = 0;

      nextChar: while (i < endIndex) {
        const node = nodes[cursor];
        const data = node >> 3;

        if ((node & LEAF) === LEAF) {
          // The node has a value

          if ((node & BRANCH) === 0) {
            // The node doesn't have children
            // data = leafCharCodesLength
            let j = 0;
            while (j < data && charCodeAt(input, i) === nodes[cursor + j + 2]) {
              ++j;
              ++i;
            }
            if (j === data) {
              valueIndex = cursor + 1;
            }
            cursor = -1;
            break;
          }

          valueIndex = ++cursor;
        }

        ++cursor;

        if ((node & BRANCH_1) === BRANCH_1) {
          // The node has a single child
          // data = charCode
          if (charCodeAt(input, i) === data) {
            ++i;
            continue;
          }
          cursor = -1;
          break;
        }

        // The node has multiple children
        // data = childCharCodesLength

        // Binary search
        const inputCharCode = charCodeAt(input, i);

        for (let left = 0, right = data - 1; left <= right; ) {
          const index = (right + left) >> 1;
          const charCodeIndex = cursor + (index << 1);
          const charCode = nodes[charCodeIndex];

          if (charCode < inputCharCode) {
            left = index + 1;
            continue;
          }
          if (charCode > inputCharCode) {
            right = index - 1;
            continue;
          }
          cursor = nodes[charCodeIndex + 1] + charCodeIndex + 2;
          ++i;
          continue nextChar;
        }

        cursor = -1;
        break;
      }

      if (i === endIndex && cursor !== -1) {
        const node = nodes[cursor];

        if (node === LEAF || ((node & BRANCH) !== 0 && (node & LEAF) === LEAF)) {
          valueIndex = cursor + 1;
        }
      }

      if (valueIndex === -1) {
        return null;
      }

      if (result !== undefined) {
        result.value = values[nodes[valueIndex]];
        result.lastIndex = i;
        return result;
      }

      return {
        value: values[nodes[valueIndex]],
        lastIndex: i,
      };
    }
  );
}
