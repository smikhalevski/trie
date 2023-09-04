import { Node } from './types';
import { getCharCodeAt } from './utils';

/**
 * Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`,
 * and returns the corresponding leaf.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 * setValue(trie, 'foobar', 222);
 *
 * search(trie, '___foobar___', 3);
 * // ⮕ Trie { key: 'foobar', value: 222, length: 6 }
 *
 * search(trie, '___fooba___', 3);
 * // ⮕ Trie { key: 'foo', value: 111, length: 3 }
 * ```
 *
 * @param node The root node of the trie.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns A leaf node in the trie or `null` if there's no matching key in the trie.
 * @template Value The value stored in a trie.
 */
export const search = createSearch(getCharCodeAt);

/**
 * Creates a function that searches the trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 * @see {@link search}
 */
export function createSearch(charCodeAt: typeof getCharCodeAt) {
  return (
    /**
     * Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at
     * `endIndex`, and returns the corresponding leaf.
     *
     * @param node The root node of the trie.
     * @param input The string to search for the key from the `trie`.
     * @param startIndex The index in `input` to start reading substring from.
     * @param endIndex The index in `input` to stop reading.
     * @returns A leaf node in the trie or `null` if there's no matching key in the trie.
     * @template Value The value stored in a trie.
     */
    <Value>(node: Node<Value>, input: string, startIndex = 0, endIndex = input.length): Node<Value> | null => {
      let leaf: Node<Value> | null = null;
      let i = startIndex;

      while (i < endIndex) {
        if (node.last !== null) {
          if (node.isLeaf) {
            leaf = node;
          }

          const child = node[charCodeAt(input, i)];
          if (child === undefined) {
            break;
          }

          node = child;
          ++i;
        } else {
          const nodeLeafCharCodes = node.leafCharCodes;
          if (nodeLeafCharCodes === null) {
            return node;
          }

          const nodeLeafCharCodesLength = nodeLeafCharCodes.length;
          if (i + nodeLeafCharCodesLength > endIndex) {
            return leaf;
          }

          let j = 0;
          while (j < nodeLeafCharCodesLength && charCodeAt(input, i) === nodeLeafCharCodes[j]) {
            ++j;
            ++i;
          }
          if (j === nodeLeafCharCodesLength) {
            return node;
          }
          return leaf;
        }
      }

      if (i === endIndex && node.isLeaf && node.leafCharCodes === null) {
        return node;
      }
      return leaf;
    }
  );
}
