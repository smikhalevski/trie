import {Trie} from './trie-types';
import {setTrie} from './setTrie';

/**
 * Sets all word-value pairs to the trie.
 *
 * @param trie The trie to update.
 * @param entries The set of word-value pairs to set.
 *
 * @template T The type of values stored in a trie.
 */
export function setAllTrie<T>(trie: Trie<T>, entries: [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>): void {
  for (const [word, value] of Array.from(entries)) {
    setTrie(trie, word, value);
  }
}
