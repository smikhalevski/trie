/**
 * The compressed trie data structure.
 *
 * @template Value The value stored in a trie.
 */
export interface Trie<Value> {
  /**
   * Mapping from char code to a corresponding child trie.
   */
  [charCode: number]: Trie<Value> | undefined;

  /**
   * The char code in {@link parent} that is associated with this trie, or -1 if trie has no {@link parent}.
   */
  charCode: number;

  /**
   * The preceding trie or `null` if this trie is a root.
   */
  parent: Trie<Value> | null;

  /**
   * The previous trie in the linked list of all nodes in the trie.
   */
  prev: Trie<Value> | null;

  /**
   * The next trie in the linked list of all nodes in the trie.
   */
  next: Trie<Value> | null;

  /**
   * The last child of the trie.
   */
  last: Trie<Value> | null;

  /**
   * The key that the leaf trie represents or `null` for a non-leaf trie.
   */
  key: string | null;

  /**
   * The value set to the trie or `undefined` for a non-leaf trie. Use {@link isLeaf} to distinguish between leaf
   * and non-leaf tries.
   */
  value: Value | undefined;

  /**
   * `true` if the trie is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * The list of remaining chars of the leaf's key.
   */
  leafCharCodes: number[] | null;

  /**
   * The list of all leafs of this trie. A memoization mechanism, populated by {@link trieSuggest} and cleaned by
   * {@link trieSet} and {@link trieDelete}.
   */
  suggestions: Trie<Value>[] | null;
}

/**
 * The array trie stores all trie branches in a flat array.
 *
 * @template Value The value stored in a trie.
 */
export interface ArrayTrie<Value> {
  /**
   * The nodes of a trie.
   */
  nodes: ArrayLike<number>;

  /**
   * Values associated with trie nodes.
   */
  values: ArrayLike<Value>;
}

/**
 * Provide this function is you want to alter the chars that are read from the string on the fly. For example, you can
 * change case or replace chars.
 *
 * @param str The string to read the char from
 * @param index The inder of the char.
 */
export type CharCodeAt = (str: string, index: number) => number;
