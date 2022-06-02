/**
 * The compressed trie data structure.
 *
 * Left-to-right navigation (set, get, search) is used for key lookup.
 *
 * Top-to-bottom navigation (suggest, delete) is used for siblings traversal.
 *
 * @template T The type of values stored in a trie.
 */
export interface Trie<T> {

  /**
   * Mapping from char code to the subsequent children.
   */
  [charCode: number]: Trie<T> | undefined;

  /**
   * The preceding trie or `null` if this trie is a root.
   */
  left: Trie<T> | null;

  /**
   * The char code in {@link left} that is associated with this trie, or -1 if trie has no {@link left}.
   */
  charCode: number;

  /**
   * `true` if this trie has subsequent trie nodes.
   */
  hasContinuation: boolean;

  // prev: Trie<T> | null;
  //
  // /**
  //  * The next trie in the ordered linked list of all tries.
  //  */
  // next: Trie<T> | null;
  //
  // /**
  //  * The last child of the trie.
  //  */
  // last: Trie<T> | null;

  /**
   * The key that the leaf trie represents or `null` for a non-leaf trie.
   */
  key: string | null;

  /**
   * The value set to the trie or `undefined` for a non-leaf trie. Use {@link isLeaf} to distinguish between
   * leaf and non-leaf tries.
   */
  value: T | undefined;

  /**
   * `true` if the trie is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * Remaining chars that the key at this trie contains. `null` if node isn't a leaf or if it has a continuation.
   */
  leafCharCodes: number[] | null;

  /**
   * The length of the prefix described by the trie. Includes {@link leafCharCodes} for leaf tries.
   */
  length: number;
}
