export interface ITrieNode<T> {

  /**
   * Char code to trie nodes map.
   */
  children: Record<number, ITrieNode<T> | undefined> | null;

  /**
   * The key that the leaf node represents or `undefined` for non-leaf nodes.
   */
  key: string | undefined;

  /**
   * The value held by this node.
   */
  value: T | undefined;

  /**
   * Remaining chars that the word at this trie node contains.
   */
  chars: Array<number> | null;

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
    children: null,
    key: undefined,
    value: undefined,
    chars: null,
    charCount: 0,
    end: false,
  };
}

function forkTrie<T>(node: ITrieNode<T>): void {
  const chars = node.chars;

  if (!chars) {
    return;
  }

  const leafNode = createTrieNode<T>();

  node.children = {[chars[0]]: leafNode};

  if (chars.length > 1) {
    leafNode.chars = chars.slice(1);
  }

  leafNode.key = node.key;
  leafNode.value = node.value;
  leafNode.charCount = node.charCount;
  leafNode.end = true;

  node.key = undefined;
  node.value = undefined;
  node.chars = null;
  node.charCount -= chars.length;
  node.end = false;
}

/**
 * Sets a new key-value pair to the trie node.
 */
export function setTrie<T>(node: ITrieNode<T>, key: string, value: T): void {

  let i = 0;
  while (i < key.length) {

    forkTrie(node);

    if (!node.end && !node.children) {
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
    leafNode.charCount = node.charCount + 1;
    node = leafNode;
    break;
  }

  forkTrie(node);

  if (i !== key.length) {
    node.chars = [];

    while (i < key.length) {
      node.chars.push(key.charCodeAt(i));
      ++i;
    }
  }

  node.key = key;
  node.value = value;
  node.charCount = i;
  node.end = true;
}

/**
 * Searches for a leaf trie node that describes the longest substring from `input` starting from `offset`.
 *
 * @param node The trie with searched keys.
 * @param input The string to search for the key from the `trie`.
 * @param offset The offset in `str` to start reading substring from.
 * @returns A node or `undefined` if there's no matching key in the `trie`.
 */
export function searchTrie<T>(node: ITrieNode<T>, input: string, offset: number): ITrieNode<T> | undefined {

  const charCount = input.length;

  let lastNode: ITrieNode<T> | undefined;

  forChars: for (let i = offset; i < charCount; ++i) {

    const chars = node.chars;

    if (chars) {
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

    const children = node.children;

    if (!children) {
      break;
    }

    const childNode = children[input.charCodeAt(i)];

    if (childNode) {
      if (childNode.end && !childNode.chars) {
        lastNode = childNode;
      }
      node = childNode;
      continue;
    }
    break;
  }

  return lastNode;
}
