import { Node } from './types';
import { search } from './search';

/**
 * Returns a leaf node associated with the key, or `null` if there's no such key in the trie.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 *
 * getNode(trie, 'foo');
 * // ⮕ Trie { key: 'foo', value: 111 }
 *
 * getNode(trie, 'bar');
 * // ⮕ null
 * ```
 *
 * @param node The root node of the trie.
 * @param key The key to retrieve.
 * @returns A leaf node in the `trie`, or `null` if there's no such key in the trie.
 * @template Value The value stored in a trie.
 */
export function getNode<Value>(node: Node<Value>, key: string): Node<Value> | null {
  const leaf = search(node, key);

  if (leaf !== null && leaf.key === key) {
    return leaf;
  }
  return null;
}
