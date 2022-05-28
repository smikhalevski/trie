import {Trie} from './trie-types';

/**
 * Searches for a leaf trie node that describes the longest substring from `input` starting from `offset`.
 *
 * @param node The trie root node.
 * @param input The string to search for the word from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A leaf node in the trie or `undefined` if there's no matching word in the `trie`.
 */
export function searchTrie<T>(node: Trie<T>, input: string, offset: number): Trie<T> | undefined {

  const inputLength = input.length;

  if (inputLength === 0 && node.isLeaf && node.word!.length === 0) {
    return node;
  }

  let lastNode: Trie<T> | undefined;

  scan: for (let i = offset; i < inputLength; ++i) {

    const leafCharCodes = node.leafCharCodes;

    if (leafCharCodes !== null) {
      const leafCharCodesLength = leafCharCodes.length;

      if (i + leafCharCodesLength > inputLength) {
        break;
      }
      for (let j = 0; j < leafCharCodesLength; ++i, ++j) {
        if (input.charCodeAt(i) !== leafCharCodes[j]) {
          break scan;
        }
      }
      lastNode = node;
      break;
    }

    if (node.isLeaf) {
      lastNode = node;
    }

    const children = node.children;
    if (children === null) {
      break;
    }

    const charCode = input.charCodeAt(i);

    const childrenCharCodes = node.childrenCharCodes!;

    let j = childrenCharCodes.length - 1;

    while (j > -1 && childrenCharCodes[j] !== charCode) {
      --j;
    }

    if (j === -1) {
      break;
    }

    const childNode = children[j];

    if (childNode.isLeaf && childNode.leafCharCodes === null) {
      lastNode = childNode;
    }
    node = childNode;
  }

  return lastNode;
}
