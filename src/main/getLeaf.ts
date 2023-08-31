import { Trie } from './types';
import { search } from './search';

/**
 * Returns a leaf associated with the key, or `null` if there's no such key.
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns A leaf in the `trie`, or `null` if there's no such key.
 * @template Value The value stored in a trie.
 */
export function getLeaf<Value>(trie: Trie<Value>, key: string): Trie<Value> | null {
  const leaf = search(trie, key);

  if (leaf !== null && leaf.key === key) {
    return leaf;
  }
  return null;
}
