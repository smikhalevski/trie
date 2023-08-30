import { ArrayTrie } from './trie-types';
import { arrayTrieSearch } from './arrayTrieSearch';

const result = { value: null, lastIndex: -1 };

/**
 * Returns a value associated with the key, or `null` if there's no such key.
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns A value stored in the `trie`, or `null` if there's no such key.
 * @template Value The value stored in a trie.
 */
export function arrayTrieGet<Value>(trie: ArrayTrie<Value>, key: string): Value | null {
  if (arrayTrieSearch(trie, key, 0, key.length, result) !== null && result.lastIndex === key.length) {
    const { value } = result;
    result.value = null;
    return value;
  }
  return null;
}
