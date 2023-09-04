import { Node } from './types';
import { search } from './search';

/**
 * Returns a value associated with the key, or `undefined` if there's no such key in the trie.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 *
 * getValue(trie, 'foo');
 * // ⮕ 111
 *
 * getValue(trie, 'bar');
 * // ⮕ undefined
 * ```
 *
 * @param node The root node of the trie.
 * @param key The key to retrieve.
 * @returns The value associated with the key, or `undefined` if there's no such key in the trie.
 * @template Value The value stored in a trie.
 */
export function getValue<Value>(node: Node<Value>, key: string): Value | undefined {
  const leaf = search(node, key);

  if (leaf !== null && leaf.key === key) {
    return leaf.value;
  }
}
