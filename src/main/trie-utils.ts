/**
 * The compressed trie data structure.
 */
export interface TrieNode<T> {

  parent: TrieNode<T> | null;

  /**
   * A dictionary from a char code to a child trie node.
   */
  children: Record<number, TrieNode<T> | undefined> | null;

  /**
   * The list of char codes that present in {@link children}.
   */
  childrenCharCodes: number[] | null;

  /**
   * The word that the leaf node represents or `null` for non-leaf nodes.
   */
  word: string | null;

  /**
   * The value held by this node.
   */
  value: T | undefined;

  /**
   * The total number of chars in the word prefix described by this trie node. Length includes {@link leafCharCodes} if
   * the trie node is a leaf node.
   */
  length: number;

  /**
   * `true` if this node is a leaf node and {@link value} contains an actual value that was set.
   */
  isLeaf: boolean;

  /**
   * Remaining chars that the word at this trie node contains.
   */
  leafCharCodes: number[] | null;
}

/**
 * Creates a trie node.
 *
 * @see {@link https://en.wikipedia.org/wiki/Trie Trie on Wikipedia}
 */
export function createTrie<T>(): TrieNode<T> {
  return {
    parent: null,
    children: null,
    childrenCharCodes: null,
    word: null,
    value: undefined,
    length: 0,
    isLeaf: false,
    leafCharCodes: null,
  };
}

function forkTrie<T>(node: TrieNode<T>): void {
  const leafCharCodes = node.leafCharCodes;

  if (leafCharCodes === null) {
    return;
  }

  const leafNode = createTrie<T>();
  const charCode = leafCharCodes[0];

  node.children = {[charCode]: leafNode};
  node.childrenCharCodes = [charCode];

  if (leafCharCodes.length > 1) {
    leafNode.leafCharCodes = leafCharCodes.slice(1);
  }

  leafNode.parent = node;
  leafNode.word = node.word;
  leafNode.value = node.value;
  leafNode.length = node.length;
  leafNode.isLeaf = true;

  node.word = null;
  node.value = undefined;
  node.length -= leafCharCodes.length;
  node.isLeaf = false;
  node.leafCharCodes = null;
}

/**
 * Sets a new word-value pair to the trie node.
 *
 * @param node The trie root node.
 * @param word The word for which the value must be set.
 * @param value The value to associate with the word.
 */
export function setTrie<T>(node: TrieNode<T>, word: string, value: T): void {

  const wordLength = word.length;

  let i = 0;
  while (i < wordLength) {

    forkTrie(node);

    if (!node.isLeaf && node.children === null) {
      break;
    }

    const children = node.children ||= {};
    const childrenCharCodes = node.childrenCharCodes ||= [];

    const charCode = word.charCodeAt(i++);
    const childNode = children[charCode];

    if (childNode !== undefined) {
      node = childNode;
      continue;
    }

    childrenCharCodes.push(charCode);

    const leafNode = children[charCode] = createTrie<T>();
    leafNode.parent = node;
    leafNode.word = node.word;
    leafNode.length = node.length + 1;

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

/**
 * Sets all word-value pairs to the trie node.
 *
 * @param node The trie root node.
 * @param entries The set of word-value pairs to set.
 */
export function setAllTrie<T>(node: TrieNode<T>, entries: [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>): void {
  for (const [word, value] of Array.from(entries)) {
    setTrie(node, word, value);
  }
}

/**
 * Returns the trie node that matches the exact word.
 *
 * @param node The trie root node.
 * @param word The word to retrieve.
 * @returns The leaf node that holds the value for `word`.
 */
export function getTrie<T>(node: TrieNode<T>, word: string): TrieNode<T> | undefined {
  const leafNode = searchTrie(node, word, 0);

  if (leafNode?.word === word) {
    return leafNode;
  }
}

/**
 * Deletes a word from a trie.
 *
 * @param node The trie root node.
 * @param word The word to delete.
 */
export function deleteTrie<T>(node: TrieNode<T>, word: string): void {

}

/**
 * Searches for a leaf trie node that describes the longest substring from `input` starting from `offset`.
 *
 * @param node The trie root node.
 * @param input The string to search for the word from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A leaf node in the trie or `undefined` if there's no matching word in the `trie`.
 */
export function searchTrie<T>(node: TrieNode<T>, input: string, offset: number): TrieNode<T> | undefined {

  const inputLength = input.length;

  if (inputLength === 0 && node.isLeaf && node.word!.length === 0) {
    return node;
  }

  let lastNode: TrieNode<T> | undefined;

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

    const childNode = children[input.charCodeAt(i)];
    if (childNode === undefined) {
      break;
    }

    if (childNode.isLeaf && childNode.leafCharCodes === null) {
      lastNode = childNode;
    }
    node = childNode;
  }

  return lastNode;
}
