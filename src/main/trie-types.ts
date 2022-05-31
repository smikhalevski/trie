/**
 * The compressed trie data structure.
 *
 * @template T The type of values stored in a trie.
 */
export interface Trie<T> {

  /**
   * The previous trie or `null` if this trie is a root.
   */
  prev: Trie<T> | null;

  /**
   * A list of sub-tries that describe consequent substrings.
   */
  next: Record<number, Trie<T> | undefined> | null;

  // /**
  //  * The keys of {@link next}.
  //  */
  // nextCharCodes: number[] | null;

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
   * The length of the prefix described by the trie. Includes {@link leafCharCodes} for leaf tries.
   */
  length: number;

  /**
   * `true` if the trie is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * Remaining chars that the key at this trie contains. `null` if node is not a leaf or if it has {@link next}.
   */
  leafCharCodes: number[] | null;
}
