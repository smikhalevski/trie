import {Trie} from './trie-types';
import {setTrie} from './setTrie';

/**
 * Sets all key-value pairs to the trie node.
 *
 * @param trie The trie to update.
 * @param entries The set of key-value pairs to set.
 */
export function setAllTrie<T>(trie: Trie<T>, entries: [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>): void {
  for (const [key, value] of Array.from(entries)) {
    setTrie(trie, key, value);
  }
}