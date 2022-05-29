import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';

/**
 * Returns the trie node that matches the key.
 *
 * @param trie The trie root.
 * @param key The key to retrieve.
 * @returns The leaf that holds the value for `key` or `undefined` if there's no such leaf.
 *
 * @template T The type of values stored in a trie.
 */
export function getTrie<T>(trie: Trie<T>, key: string): Trie<T> | undefined {
  const leafTrie = searchTrie(trie, key, 0);

  if (leafTrie?.key === key) {
    return leafTrie;
  }
}
