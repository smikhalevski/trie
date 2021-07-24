export interface ITrieNode<T> {

  /**
   * Remaining chars that the word at this trie node contains.
   */
  chars: Array<number> | null;

  /**
   * Char code to trie nodes map.
   */
  children: Record<number, ITrieNode<T>> | null;

  /**
   * The value held by this node.
   */
  value: T | undefined;

  /**
   * The total number of chars in the word described by this trie node, including {@link chars}.
   */
  charCount: number;

  /**
   * `true` if this node is a leaf node and {@link value} contains an actual value that was set.
   */
  end: boolean;
}

/**
 * Creates a compressed trie node.
 *
 * @see {@link https://en.wikipedia.org/wiki/Trie Trie on Wikipedia}
 */
export function createTrieNode<T>(): ITrieNode<T> {
  return {
    chars: null,
    children: null,
    value: undefined,
    charCount: 0,
    end: false,
  };
}

/**
 * Sets a new key-value pair to the trie node.
 */
export function setToTrieNode<T>(node: ITrieNode<T>, key: string, value: T): void {

  let i = 0;
  while (i < key.length) {

    const chars = node.chars;

    if (chars) {
      const leafNode = createTrieNode<T>();
      node.children = {[chars[0]]: leafNode};

      if (chars.length > 1) {
        leafNode.chars = chars.slice(1);
      }

      leafNode.charCount = node.charCount;
      leafNode.value = node.value;
      leafNode.end = true;

      node.charCount -= chars.length;
      node.chars = null;
      node.value = undefined;
      node.end = false;
    }

    let children = node.children;

    if (!node.end && children === null) {
      break;
    }

    children = node.children ||= {};

    const charCode = key.charCodeAt(i);
    const childNode = children[charCode];

    ++i;

    if (childNode) {
      node = childNode;
      continue;
    }

    const leafNode = createTrieNode<T>();
    children[charCode] = leafNode;
    leafNode.charCount = node.charCount + 1;
    node = leafNode;
    break;
  }

  if (i !== key.length) {
    node.chars = [];
    while (i < key.length) {
      node.chars.push(key.charCodeAt(i));
      ++i;
    }
  }
  node.charCount = i;
  node.value = value;
  node.end = true;
}

/**
 * Searches for a leaf trie node that describes the longest substring from `str` starting from `offset`.
 *
 * @param node The trie with searched keys.
 * @param input The string to search for the key from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A node or `undefined` if there's no matching key in the `trie`.
 */
export function searchTrieNode<T>(node: ITrieNode<T>, input: string, offset: number): ITrieNode<T> | undefined {

  const charCount = input.length;

  let lastNode: ITrieNode<T> | undefined;

  forChars: for (let i = offset; i < charCount; ++i) {

    const {chars, children} = node;
    if (chars !== null) {
      const length = chars.length;

      if (i + length > charCount) {
        break;
      }
      for (let j = 0; j < length; ++i, ++j) {
        if (input.charCodeAt(i) !== chars[j]) {
          break forChars;
        }
      }
      lastNode = node;
      break;
    }
    if (node.end) {
      lastNode = node;
    }
    if (children === null) {
      break;
    }

    node = children[input.charCodeAt(i)];

    if (node) {
      if (node.end && node.chars === null) {
        lastNode = node;
      }
      continue;
    }
    break;
  }

  return lastNode;
}
