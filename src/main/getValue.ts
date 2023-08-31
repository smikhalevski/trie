import { Trie } from './types';
import { search } from './search';

/**
 * Returns a value associated with the key, or `undefined` if there's no such key.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 *
 * getValue(trie, 'foo');
 * // ⮕ 111
 *
 * getLeaf(trie, 'bar');
 * // ⮕ undefined
 * ```
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns The value associated with the key, or `undefined` if there's no such key.
 * @template Value The value stored in a trie.
 */
export function getValue<Value>(trie: Trie<Value>, key: string): Value | undefined {
  const leaf = search(trie, key);

  if (leaf !== null && leaf.key === key) {
    return leaf.value;
  }
}
