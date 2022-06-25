import { Trie } from './trie-types';
import { trieGet } from './trieGet';

/**
 * Updates a new key-value pair only if the key already exists in the trie.
 *
 * @param trie The trie root.
 * @param key The key of to update.
 * @param value The new value to associate with the key.
 * @returns The leaf that was updated or `null` if `key` doesn't exist in the trie.
 *
 * @template T The type of values stored in a trie.
 */
export function trieUpdate<T>(trie: Trie<T>, key: string, value: T): Trie<T> | null {
  const leaf = trieGet(trie, key);

  if (leaf === null) {
    return null;
  }
  leaf.value = value;
  return leaf;
}
