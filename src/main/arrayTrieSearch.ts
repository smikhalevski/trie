import { ArrayTrie } from './trie-types';
import { NodeType } from './arrayTrieEncode';

export interface ArrayTrieSearchResult<Value> {
  /**
   * The value that corresponds to the matched key.
   */
  value: Value;

  /**
   * The last index at which the key was successfully matched.
   */
  lastIndex: number;
}

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
export function arrayTrieSearch<Value>(
  trie: ArrayTrie<Value>,
  input: string,
  startIndex = 0,
  endIndex = input.length,
  result?: ArrayTrieSearchResult<Value>
): ArrayTrieSearchResult<Value> | null {
  const { nodes, values } = trie;

  let i = startIndex;
  let valueIndex = -1;
  let cursor = 0;

  nextChar: while (i < endIndex) {
    const node = nodes[cursor];
    const data = node >> 3;

    if ((node & NodeType.LEAF) === NodeType.LEAF) {
      // The node has a value

      if ((node & NodeType.BRANCH) === 0) {
        // The node doesn't have children
        // data = leafCharCodesLength
        let j = 0;
        while (j < data && input.charCodeAt(i) === nodes[cursor + j + 2]) {
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

    if ((node & NodeType.BRANCH_1) === NodeType.BRANCH_1) {
      // The node has a single child
      // data = charCode
      if (input.charCodeAt(i) === data) {
        ++i;
        continue;
      }
      cursor = -1;
      break;
    }

    // The node has multiple children
    // data = childCharCodesLength

    // Binary search
    for (let left = 0, right = data - 1, inputCharCode = input.charCodeAt(i); left <= right; ) {
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

    if (node === NodeType.LEAF || ((node & NodeType.BRANCH) !== 0 && (node & NodeType.LEAF) === NodeType.LEAF)) {
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
