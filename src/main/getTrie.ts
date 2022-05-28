import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';

/**
 * Returns the trie node that matches the exact word.
 *
 * @param node The trie root node.
 * @param word The word to retrieve.
 * @returns The leaf node that holds the value for `word`.
 */
export function getTrie<T>(node: Trie<T>, word: string): Trie<T> | undefined {
  const leafNode = searchTrie(node, word, 0);

  if (leafNode?.word === word) {
    return leafNode;
  }
}
