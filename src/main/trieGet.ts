import { Trie } from './trie-types';
import { trieSearch } from './trieSearch';

/**
 * Returns a leaf associated with the key, or `null` if there's no such key.
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns A leaf in the `trie`, or `null` if there's no such key.
 *
 * @template T The type of values stored in a trie.
 */
export function trieGet<T>(trie: Trie<T>, key: string): Trie<T> | null {
  const leaf = trieSearch(trie, key);

  return leaf !== null && leaf.key === key ? leaf : null;
}
