import {Trie} from './trie-types';
import {setTrie} from './setTrie';

/**
 * Sets all word-value pairs to the trie node.
 *
 * @param node The trie root node.
 * @param entries The set of word-value pairs to set.
 */
export function setAllTrie<T>(node: Trie<T>, entries: [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>): void {
  for (const [word, value] of Array.from(entries)) {
    setTrie(node, word, value);
  }
}
