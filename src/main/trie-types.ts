/**
 * The compressed trie data structure.
 */
export interface TrieNode<T> {

  prev: TrieNode<T> | null;

  /**
   * A dictionary from a char code to a child trie node.
   */
  children: TrieNode<T>[] | null;

  /**
   * The list of char codes that present in {@link children}.
   */
  childrenCharCodes: number[] | null;

  /**
   * The word that the leaf node represents or `null` for non-leaf nodes.
   */
  word: string | null;

  /**
   * The value held by this node.
   */
  value: T | undefined;

  /**
   * The total number of chars in the word prefix described by this trie node. Length includes {@link leafCharCodes} if
   * the trie node is a leaf node.
   */
  length: number;

  /**
   * `true` if this node is a leaf node and {@link value} contains an actual value that was set.
   */
  isLeaf: boolean;

  /**
   * Remaining chars that the word at this trie node contains.
   */
  leafCharCodes: number[] | null;
}
