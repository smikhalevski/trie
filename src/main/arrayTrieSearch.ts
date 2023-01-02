import { ArrayTrie, NodeType } from './trie-types';

/**
 * The result returned by the {@linkcode arrayTrieSearch}.
 */
export type ArrayTrieSearchResult<T> = [value: T, actualEndIndex: number];

/**
 * Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends
 * at `endIndex`.
 *
 * @param trie The array trie.
 * @param input The string to search for the key from the `trie`.
 * @param [startIndex = 0] The index in `input` to start reading substring from.
 * @param [endIndex = input.length] The index in `input` to stop reading.
 * @param [result] The in-out result object. A new object is created on every call if this parameter is omitted.
 * @returns A fulfilled `result` or `null` if there's no matching key.
 * @template T The value stored in a trie.
 */
export function arrayTrieSearch<T>(
  trie: ArrayTrie<T>,
  input: string,
  startIndex = 0,
  endIndex = input.length,
  result?: ArrayTrieSearchResult<T>
): ArrayTrieSearchResult<T> | null {
  const { nodes, values } = trie;

  let valueIndex = -1;
  let cursor = 0;
  let i = startIndex;

  search: while (i < endIndex) {
    const node = nodes[cursor++];
    const nodeType = node & 0b111;
    const payload = node >> 3;

    if (nodeType === NodeType.LEAF) {
      // data = leafCharCodesLength
      if (i + payload > endIndex) {
        break;
      }

      if (payload === 0) {
        valueIndex = nodes[cursor];
        break;
      }

      let j = 0;
      while (j < payload && input.charCodeAt(i) === nodes[cursor + j + 1]) {
        ++j;
        ++i;
      }
      if (j === payload) {
        valueIndex = nodes[cursor];
      }
      break;
    }

    if (nodeType === NodeType.SINGLE_BRANCH) {
      // data = charCode
      if (input.charCodeAt(i) !== payload) {
        break;
      }
      ++i;
      continue;
    }

    if (nodeType === NodeType.SINGLE_BRANCH_LEAF) {
      // data = charCode
      valueIndex = nodes[cursor];

      if (input.charCodeAt(i) !== payload) {
        break;
      }
      ++cursor;
      ++i;
      continue;
    }

    if (nodeType === NodeType.MULTI_BRANCH) {
      // data = childCharCodesLength
      const charCode = input.charCodeAt(i);
      ++i;

      for (let k = 0; k < payload; ++k) {
        if (charCode === nodes[cursor + k * 2]) {
          cursor = nodes[cursor + k * 2 + 1];
          continue search;
        }
      }
      break;
    }

    if (nodeType === NodeType.MULTI_BRANCH_LEAF) {
      // data = childCharCodesLength
      valueIndex = nodes[cursor];

      ++cursor;
      const charCode = input.charCodeAt(i);
      ++i;

      for (let k = 0; k < payload; ++k) {
        if (charCode === nodes[cursor + k * 2]) {
          cursor = nodes[cursor + k * 2 + 1];
          continue search;
        }
      }
      break;
    }
  }

  if (i === endIndex && cursor < nodes.length) {
    const node = nodes[cursor];
    const nodeType = node & 0b111;

    if (
      nodeType === NodeType.MULTI_BRANCH_LEAF ||
      nodeType === NodeType.SINGLE_BRANCH_LEAF ||
      (nodeType === NodeType.LEAF && node >> 3 === 0)
    ) {
      valueIndex = nodes[cursor + 1];
    }
  }

  if (valueIndex === -1) {
    return null;
  }

  return [values[valueIndex], i];
}
