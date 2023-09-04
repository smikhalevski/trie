import { Node } from './types';
import { getCharCodeAt } from './utils';

/**
 * Returns the cached readonly array of leaf nodes that have keys starting with `input.substring(startIndex, endIndex)`.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'hotdog', 111);
 * setValue(trie, 'hotter', 222);
 * setValue(trie, 'hottest', 333);
 *
 * suggestNodes(trie, 'hot');
 * // ⮕ [Trie { key: 'hotdog' }, Trie { key: 'hotter' }, Trie { key: 'hottest' }]
 *
 * suggestNodes(trie, 'hott');
 * // ⮕ [Trie { key: 'hotter' }, Trie { key: 'hottest' }]
 *
 * suggestNodes(trie, 'cold');
 * // ⮕ null
 * ```
 *
 * @param node The root node of the trie.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The cached readonly array of leaf nodes or `null` if there's no matching key.
 * @template Value The value stored in a trie.
 * @see {@link suggestValues}
 */
export const suggestNodes = createSuggestNodes(getCharCodeAt);

/**
 * Creates a function that produces suggestions from a trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 * @see {@link suggest}
 */
export function createSuggestNodes(charCodeAt: typeof getCharCodeAt) {
  return (
    /**
     * Returns the cached readonly array of leaf nodes that have keys starting with
     * `input.substring(startIndex, endIndex)`.
     *
     * @param node The root node of the trie.
     * @param input The string to search for the key from the `trie`.
     * @param startIndex The index in `input` to start reading substring from.
     * @param endIndex The index in `input` to stop reading.
     * @returns The cached readonly array of leafs or `null` if there's no matching key.
     * @template Value The value stored in a trie.
     */
    <Value>(
      node: Node<Value>,
      input: string,
      startIndex = 0,
      endIndex = input.length
    ): readonly Node<Value>[] | null => {
      let i = startIndex;

      while (i < endIndex) {
        if (node.last === null) {
          break;
        }

        const child = node[charCodeAt(input, i)];
        if (child === undefined) {
          break;
        }

        node = child;
        ++i;
      }

      // Check that there's a sufficient number of characters to satisfy the requested prefix
      if (i !== endIndex) {
        const nodeLeafCharCodes = node.leafCharCodes;
        if (nodeLeafCharCodes === null) {
          return null;
        }

        const restLength = endIndex - i;

        const nodeLeafCharCodesLength = nodeLeafCharCodes.length;
        if (nodeLeafCharCodesLength < restLength) {
          return null;
        }

        let j = 0;
        while (j < restLength && charCodeAt(input, i) === nodeLeafCharCodes[j]) {
          ++j;
          ++i;
        }
        if (j < restLength) {
          return null;
        }
      }

      const nodeSuggestions = node.suggestions;
      if (nodeSuggestions !== null) {
        return nodeSuggestions;
      }

      const suggestions: Node<Value>[] = [];

      if (node.isLeaf) {
        suggestions.push(node);
      }

      // Collect leafs
      for (let next = node.next, last = node.last; next !== null && last !== null; next = next.next) {
        if (next.isLeaf) {
          suggestions.push(next);
        }
        if (next === last) {
          last = next.last;
        }
      }

      // Populate leafs for ancestors that have only one child
      for (let parent = node.parent; parent !== null && parent.next === parent.last; parent = parent.parent) {
        parent.suggestions = suggestions;
      }

      node.suggestions = suggestions;

      return suggestions;
    }
  );
}
