import {Trie} from './trie-types';
import {findTrie} from './findTrie';

/**
 * Returns the leaf that describes the key.
 *
 * @param trie The trie root.
 * @param key The key to retrieve.
 * @returns The leaf that holds the value for `key` or `undefined` if there's no such leaf.
 *
 * @template T The type of values stored in a trie.
 */
export function getTrie<T>(trie: Trie<T>, key: string): Trie<T> | null {
  const leaf = findTrie(trie, key, 0);

  return leaf === null || leaf.key !== key ? null : leaf;
}
