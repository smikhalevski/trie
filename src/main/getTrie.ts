import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';

/**
 * Returns the leaf that describes the word.
 *
 * @param trie The trie root.
 * @param word The word to retrieve.
 * @returns The leaf that holds the value for `word` or `undefined` if there's no such leaf.
 *
 * @template T The type of values stored in a trie.
 */
export function getTrie<T>(trie: Trie<T>, word: string): Trie<T> | undefined {
  const leaf = searchTrie(trie, word, 0);

  if (leaf !== undefined && leaf.word!.length === word.length) {
    return leaf;
  }
}
