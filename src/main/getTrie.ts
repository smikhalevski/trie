import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';

/**
 * Returns the trie node that matches the exact key.
 *
 * @param node The trie root node.
 * @param key The key to retrieve.
 * @returns The leaf node that holds the value for `key`.
 */
export function getTrie<T>(node: Trie<T>, key: string): Trie<T> | undefined {
  const leafNode = searchTrie(node, key, 0);

  if (leafNode?.key === key) {
    return leafNode;
  }
}
