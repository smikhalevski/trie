/**
 * The compressed trie data structure. It supports two traversal algorithms: parent-child (used for set, get, search)
 * and linked list (used for suggest, delete).
 *
 * @template T The type of values stored in a trie.
 */
export interface Trie<T> {

  /**
   * Mapping from char code to the trie children.
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
   * The preceding trie in the linked list of all nodes in the trie.
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
   * The value set to the trie or `undefined` for a non-leaf trie. Use {@link isLeaf} to distinguish between leaf and
   * non-leaf tries.
   */
  value: T | undefined;

  /**
   * `true` if the trie is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * Remaining chars of the leaf's key. `null` if node isn't a leaf or if it has a {@link last}.
   */
  leafCharCodes: number[] | null;

  /**
   * The list of all leafs of the trie.
   */
  suggestions: Trie<T>[] | null;
}
