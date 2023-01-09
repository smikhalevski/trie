import { ArrayTrie } from './trie-types';
import { arrayTrieSearch } from './arrayTrieSearch';

/**
 * Returns a value associated with the key, or `null` if there's no such key.
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns A value stored in the `trie`, or `null` if there's no such key.
 * @template T The value stored in a trie.
 */
export function arrayTrieGet<T>(trie: ArrayTrie<T>, key: string): T | null {
  const result = arrayTrieSearch(trie, key);

  if (result !== null && result.lastIndex === key.length) {
    return result.value;
  }
  return null;
}
