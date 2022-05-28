export interface TrieNode<T> {

  /**
   * A dictionary from a char code to a child trie node.
   */
  children: { [charCode: number]: TrieNode<T> | undefined } | null;

  /**
   * The key that the leaf node represents or `null` for non-leaf nodes.
   */
  key: string | null;

  /**
   * The value held by this node.
   */
  value: T | undefined;

  /**
   * Remaining chars that the word at this trie node contains.
   */
  finalCharCodes: Array<number> | null;

  /**
   * The total number of chars in the word described by this trie node, including {@link finalCharCodes}.
   */
  length: number;

  /**
   * `true` if this node is a leaf node and {@link value} contains an actual value that was set.
   */
  final: boolean;
}

/**
 * Creates a compressed trie node.
 *
 * @see {@link https://en.wikipedia.org/wiki/Trie Trie on Wikipedia}
 */
export function createTrieNode<T>(): TrieNode<T> {
  return {
    children: null,
    key: null,
    value: undefined,
    finalCharCodes: null,
    length: 0,
    final: false,
  };
}

function forkTrieNode<T>(node: TrieNode<T>): void {
  const finalCharCodes = node.finalCharCodes;

  if (finalCharCodes === null) {
    return;
  }

  const leafNode = createTrieNode<T>();

  node.children = {[finalCharCodes[0]]: leafNode};

  if (finalCharCodes.length > 1) {
    leafNode.finalCharCodes = finalCharCodes.slice(1);
  }

  leafNode.key = node.key;
  leafNode.value = node.value;
  leafNode.length = node.length;
  leafNode.final = true;

  node.key = null;
  node.value = undefined;
  node.finalCharCodes = null;
  node.length -= finalCharCodes.length;
  node.final = false;
}

/**
 * Sets a new key-value pair to the trie node.
 */
export function setTrieNode<T>(node: TrieNode<T>, key: string, value: T): void {

  const keyLength = key.length;

  let i = 0;
  while (i < keyLength) {

    forkTrieNode(node);

    if (!node.final && node.children === null) {
      break;
    }

    const children = node.children ||= {};
    const charCode = key.charCodeAt(i);
    const childNode = children[charCode];

    ++i;

    if (childNode) {
      node = childNode;
      continue;
    }

    const leafNode = createTrieNode<T>();
    children[charCode] = leafNode;
    leafNode.key = node.key;
    leafNode.length = node.length + 1;
    node = leafNode;
    break;
  }

  forkTrieNode(node);

  if (i !== keyLength) {
    node.finalCharCodes = [];

    while (i < keyLength) {
      node.finalCharCodes.push(key.charCodeAt(i));
      ++i;
    }
  }

  node.key = key;
  node.value = value;
  node.length = i;
  node.final = true;
}

/**
 * Searches for a leaf trie node that describes the longest substring from `input` starting from `offset`.
 *
 * @param node The trie with searched keys.
 * @param input The string to search for the key from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A leaf node in the trie or `undefined` if there's no matching key in the `trie`.
 */
export function searchTrieNode<T>(node: TrieNode<T>, input: string, offset: number): TrieNode<T> | undefined {

  const inputLength = input.length;

  if (inputLength === 0 && node.final && node.key!.length === 0) {
    return node;
  }

  let lastNode: TrieNode<T> | undefined;

  scan: for (let i = offset; i < inputLength; ++i) {

    const finalCharCodes = node.finalCharCodes;

    if (finalCharCodes !== null) {
      const charsLength = finalCharCodes.length;

      if (i + charsLength > inputLength) {
        break;
      }
      for (let j = 0; j < charsLength; ++i, ++j) {
        if (input.charCodeAt(i) !== finalCharCodes[j]) {
          break scan;
        }
      }
      lastNode = node;
      break;
    }

    if (node.final) {
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

    if (childNode.final && childNode.finalCharCodes === null) {
      lastNode = childNode;
    }
    node = childNode;
  }

  return lastNode;
}
