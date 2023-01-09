import { ArrayTrie } from './trie-types';
import { Mask } from './arrayTrieEncode';

export interface ArrayTrieSearchResult<T> {
  /**
   * The value that corresponds to the matched key.
   */
  value: T;

  /**
   * The last index at which the key was successfully matched.
   */
  lastIndex: number;
}

const result: ArrayTrieSearchResult<any> = {
  value: null,
  lastIndex: -1,
};

/**
 * Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends
 * at `endIndex`.
 *
 * @param trie The array trie.
 * @param input The string to search for the key from the `trie`.
 * @param [startIndex = 0] The index in `input` to start reading substring from.
 * @param [endIndex = input.length] The index in `input` to stop reading.
 * @returns The search result or `null` if there's no matching key. The returned object is reused between invocations.
 * @template T The value stored in a trie.
 */
export function arrayTrieSearch<T>(
  trie: ArrayTrie<T>,
  input: string,
  startIndex = 0,
  endIndex = input.length
): ArrayTrieSearchResult<T> | null {
  const { nodes, values } = trie;

  let valueIndex = -1;
  let cursor = 0;
  let i = startIndex;
  let node;
  let data;

  nextChar: while (i < endIndex) {
    node = nodes[cursor];
    data = node >> 3;

    if ((node & Mask.MASK) === Mask.LEAF) {
      // data = leafCharCodesLength
      const valueCursor = ++cursor;

      if (data !== 0 && i + data <= endIndex) {
        while (data !== 0 && input.charCodeAt(i) === nodes[++cursor]) {
          --data;
          ++i;
        }
      }
      if (data === 0) {
        valueIndex = nodes[valueCursor];
      }
      cursor = -1;
      break;
    }

    if ((node & Mask.LEAF) === Mask.LEAF) {
      valueIndex = nodes[++cursor];
    }

    if ((node & Mask.BRANCH_1) === Mask.BRANCH_1) {
      // data = charCode
      if (input.charCodeAt(i) !== data) {
        cursor = -1;
        break;
      }
      ++cursor;
      ++i;
      continue;
    }

    // data = childCharCodesLength
    const inputCharCode = input.charCodeAt(i);

    ++cursor;

    // Binary search
    let a = 0;
    let b = data - 1;

    while (a <= b) {
      const k = (b + a) >> 1;
      const charCode = nodes[cursor + k * 2];

      if (charCode < inputCharCode) {
        a = k + 1;
      } else if (charCode > inputCharCode) {
        b = k - 1;
      } else {
        cursor = nodes[++cursor + k * 2];
        ++i;
        continue nextChar;
      }
    }

    cursor = -1;
    break;
  }

  if (i === endIndex && cursor !== -1) {
    node = nodes[cursor];

    if (node === Mask.LEAF || (node & Mask.MASK) === Mask.BRANCH_1_LEAF || (node & Mask.MASK) === Mask.BRANCH_N_LEAF) {
      valueIndex = nodes[cursor + 1];
    }
  }

  if (valueIndex === -1) {
    return null;
  }

  result.value = values[valueIndex];
  result.lastIndex = i;

  return result;
}
