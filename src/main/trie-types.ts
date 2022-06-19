/**
 * The compressed trie data structure that supports list-like traversal.
 *
 * @template T The type of values stored in a trie.
 */
export interface Trie<T> {

  /**
   * Mapping from char code to a corresponding child.
   */
  [charCode: number]: Trie<T> | undefined;

  /**
   * The char code in {@link parent} that is associated with this trie, or -1 if trie has no {@link parent}.
   */
  charCode: number;

  /**
   * The preceding trie or `null` if this trie is a root.
   */
  parent: Trie<T> | null;

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
   * The value set to the trie or `undefined` for a non-leaf trie. Use {@link isLeaf} to distinguish between leaf and
   * non-leaf tries.
   */
  value: T | undefined;

  /**
   * `true` if the trie is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * The list of remaining chars of the leaf's key. `null` if node isn't a leaf or if it has the non-`null` {@link last}
   * pointer.
   */
  leafCharCodes: number[] | null;

  /**
   * The list of all leafs of this trie. A memoization mechanism, populated by {@link trieSearch} and cleaned by
   * {@link trieSet} and {@link trieDelete}.
   */
  leafs: Trie<T>[] | null;
}
