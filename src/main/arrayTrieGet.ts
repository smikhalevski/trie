import { ArrayTrie } from './trie-types';
import { arrayTrieSearch, ArrayTrieSearchResult } from './arrayTrieSearch';

const result: ArrayTrieSearchResult<any> = { value: null, lastIndex: -1 };

/**
 * Returns a value associated with the key, or `null` if there's no such key.
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns A value stored in the `trie`, or `null` if there's no such key.
 * @template T The value stored in a trie.
 */
export function arrayTrieGet<T>(trie: ArrayTrie<T>, key: string): T | null {
  if (arrayTrieSearch(trie, key, 0, key.length, result) !== null && result.lastIndex === key.length) {
    const { value } = result;
    result.value = null;
    return value;
  }
  return null;
}
