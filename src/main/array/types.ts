/**
 * The search result returned from {@link search}.
 */
export interface Match<Value = any> {
  /**
   * The value that corresponds to the matched key.
   */
  value: Value;

  /**
   * The last index in the input at which the key was successfully matched.
   */
  lastIndex: number;
}

/**
 * The array trie stores all trie branches in a flat array.
 *
 * @template Value The value stored in a trie.
 */
export interface ArrayTrie<Value = any> {
  /**
   * The nodes of a trie.
   */
  nodes: ArrayLike<number>;

  /**
   * Values associated with trie nodes.
   */
  values: ArrayLike<Value>;
}
