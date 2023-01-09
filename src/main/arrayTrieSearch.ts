import { ArrayTrie, NodeType } from './trie-types';

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

  nextChar: while (i < endIndex) {
    const node = nodes[cursor];
    const type = node & 0b111;
    const data = node >> 3;

    if (type === NodeType.LEAF) {
      // data = leafCharCodesLength
      if (i + data > endIndex) {
        // No match, overflow
        cursor = -1;
        break;
      }

      if (data === 0) {
        // Match, no remaining characters
        valueIndex = nodes[cursor + 1];
        cursor = -1;
        break;
      }

      let j = 0;
      while (j < data && input.charCodeAt(i) === nodes[cursor + j + 2]) {
        ++j;
        ++i;
      }
      if (j === data) {
        // Match, remaining characters matched
        valueIndex = nodes[cursor + 1];
      }
      cursor = -1;
      break;
    }

    if (type === NodeType.SINGLE_BRANCH) {
      // data = charCode
      if (input.charCodeAt(i) !== data) {
        cursor = -1;
        break;
      }
      ++cursor;
      ++i;
      continue;
    }

    if (type === NodeType.SINGLE_BRANCH_LEAF) {
      // data = charCode
      valueIndex = nodes[cursor + 1];

      if (input.charCodeAt(i) !== data) {
        cursor = -1;
        break;
      }
      cursor += 2;
      ++i;
      continue;
    }

    if (type === NodeType.MULTI_BRANCH) {
      // data = childCharCodesLength
      const charCode = input.charCodeAt(i);

      for (let j = 0; j < data; ++j) {
        if (charCode === nodes[cursor + j * 2 + 1]) {
          // Match
          cursor = nodes[cursor + j * 2 + 2];
          ++i;
          continue nextChar;
        }
      }

      // No match, unexpected char
      cursor = -1;
      break;
    }

    if (type === NodeType.MULTI_BRANCH_LEAF) {
      // data = childCharCodesLength
      valueIndex = nodes[cursor + 1];

      const charCode = input.charCodeAt(i);

      for (let k = 0; k < data; ++k) {
        if (charCode === nodes[cursor + k * 2 + 2]) {
          // Match
          cursor = nodes[cursor + k * 2 + 3];
          ++i;
          continue nextChar;
        }
      }

      // No match, unexpected char
      cursor = -1;
      break;
    }
  }

  if (i === endIndex && cursor !== -1) {
    const node = nodes[cursor];
    const type = node & 0b111;

    if (
      (type === NodeType.LEAF && node >> 3 === 0) ||
      type === NodeType.SINGLE_BRANCH_LEAF ||
      type === NodeType.MULTI_BRANCH_LEAF
    ) {
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
