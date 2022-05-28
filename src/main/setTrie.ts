import {Trie} from './trie-types';
import {createTrie} from './createTrie';

/**
 * Sets a new word-value pair to the trie node.
 *
 * @param node The trie root node.
 * @param word The word for which the value must be set.
 * @param value The value to associate with the word.
 */
export function setTrie<T>(node: Trie<T>, word: string, value: T): void {

  const wordLength = word.length;

  let i = 0;
  while (i < wordLength) {

    forkTrie(node);

    if (!node.isLeaf && node.children === null) {
      break;
    }

    const children = node.children ||= [];
    const childrenCharCodes = node.childrenCharCodes ||= [];

    const charCode = word.charCodeAt(i++);

    const childIndex = childrenCharCodes.indexOf(charCode);

    const childNode = children[childIndex];

    if (childNode !== undefined) {
      node = childNode;
      continue;
    }

    const leafNode = createTrie<T>();
    leafNode.prev = node;
    leafNode.word = node.word;
    leafNode.length = node.length + 1;

    children.push(leafNode);
    childrenCharCodes.push(charCode);

    node = leafNode;
    break;
  }

  forkTrie(node);

  if (i !== wordLength) {
    node.leafCharCodes = [];

    while (i < wordLength) {
      node.leafCharCodes.push(word.charCodeAt(i));
      ++i;
    }
  }

  node.word = word;
  node.value = value;
  node.length = i;
  node.isLeaf = true;
}

function forkTrie<T>(trie: Trie<T>): void {
  const leafCharCodes = trie.leafCharCodes;

  if (leafCharCodes === null) {
    return;
  }

  const leafTrie = createTrie<T>();
  const charCode = leafCharCodes[0];

  trie.children = [leafTrie];
  trie.childrenCharCodes = [charCode];

  if (leafCharCodes.length > 1) {
    leafTrie.leafCharCodes = leafCharCodes.slice(1);
  }

  leafTrie.prev = trie;
  leafTrie.word = trie.word;
  leafTrie.value = trie.value;
  leafTrie.length = trie.length;
  leafTrie.isLeaf = true;

  trie.word = null;
  trie.value = undefined;
  trie.length -= leafCharCodes.length;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
