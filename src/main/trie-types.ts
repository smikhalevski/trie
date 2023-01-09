/**
 * The compressed trie data structure.
 *
 * @template T The value stored in a trie.
 */
export interface Trie<T> {
  /**
   * Mapping from char code to a corresponding child trie.
   */
  [charCode: number]: Trie<T> | undefined;

  /**
   * The char code in {@linkcode parent} that is associated with this trie, or -1 if trie has no {@linkcode parent}.
   */
  charCode: number;

  /**
   * The preceding trie or `null` if this trie is a root.
   */
  parent: Trie<T> | null;

  /**
   * The previous trie in the linked list of all nodes in the trie.
   */
  prev: Trie<T> | null;

  /**
   * The next trie in the linked list of all nodes in the trie.
   */
  next: Trie<T> | null;

  /**
   * The last child of the trie.
   */
  last: Trie<T> | null;

  /**
   * The key that the leaf trie represents or `null` for a non-leaf trie.
   */
  key: string | null;

  /**
   * The value set to the trie or `undefined` for a non-leaf trie. Use {@linkcode isLeaf} to distinguish between leaf
   * and non-leaf tries.
   */
  value: T | undefined;

  /**
   * `true` if the trie is a leaf and has a {@linkcode value}.
   */
  isLeaf: boolean;

  /**
   * The list of remaining chars of the leaf's key.
   */
  leafCharCodes: number[] | null;

  /**
   * The list of all leafs of this trie. A memoization mechanism, populated by {@linkcode trieSuggest} and cleaned by
   * {@linkcode trieSet} and {@linkcode trieDelete}.
   */
  suggestions: Trie<T>[] | null;
}

/**
 * The array trie stores all trie branches in a flat array.
 */
export interface ArrayTrie<T> {
  /**
   * The nodes of a trie.
   */
  nodes: ArrayLike<number>;

  /**
   * Values associated with trie nodes.
   */
  values: ArrayLike<T>;
}
