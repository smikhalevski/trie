import { Trie } from './types';
import { suggestLeafs } from './suggestLeafs';

/**
 * Returns the array of value from the trie that have keys starting with `input.substring(startIndex, endIndex)`.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'hotdog', 111);
 * setValue(trie, 'hotter', 222);
 * setValue(trie, 'hottest', 333);
 *
 * suggestValues(trie, 'hot');
 * // ⮕ [111, 222, 333]
 *
 * suggestValues(trie, 'hott');
 * // ⮕ [222, 333]
 *
 * suggestValues(trie, 'cold');
 * // ⮕ []
 * ```
 *
 * @param trie The trie root.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The array of values associated with the matching keys.
 * @template Value The value stored in a trie.
 * @see {@link suggestLeafs}
 */
export function suggestValues<Value>(
  trie: Trie<Value>,
  input: string,
  startIndex = 0,
  endIndex = input.length
): Value[] {
  const leafs = suggestLeafs(trie, input, startIndex, endIndex);

  if (leafs === null) {
    return [];
  }

  const values = [];

  for (let i = 0; i < leafs.length; ++i) {
    values[i] = leafs[i].value!;
  }
  return values;
}
