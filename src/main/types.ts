/**
 * The compressed trie data structure.
 *
 * @template Value The value stored in a trie.
 */
export interface Trie<Value = any> {
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
   * The list of all leafs of this trie. A memoization mechanism, populated by {@link suggest} and cleaned by
   * {@link setValue} and {@link deleteLeaf}.
   */
  suggestions: Trie<Value>[] | null;
}

/**
 * The array trie stores all trie branches in a flat array.
 *
 * @template Value The value stored in a trie.
 */
export interface EncodedTrie<Value = any> {
  /**
   * The nodes of a trie.
   */
  nodes: ArrayLike<number>;

  /**
   * Values associated with trie nodes.
   */
  values: ArrayLike<Value>;
}
