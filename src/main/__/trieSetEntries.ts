import {Trie} from '../trie-types';
import {trieSet} from '../trieSet';

/**
 * Sets all key-value pairs to the trie.
 *
 * @param trie The trie to update.
 * @param entries The set of key-value pairs to set.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSetEntries<T>(trie: Trie<T>, entries: [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>): void {
  for (const [word, value] of Array.from(entries)) {
    trieSet(trie, word, value);
  }
}