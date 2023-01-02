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
 * The array trie that is an objectless trie representation. It stores trie structure in an array where elements
 * represent nodes in a trie.
 */
export interface ArrayTrie<T> {
  nodes: ArrayLike<number>;
  values: ArrayLike<T>;
}

/**
 * {@linkcode ArrayTrie.nodes} contain encoded trie nodes. Each node has a type and additional data. Each node
 * constrains the consequent array elements as described in the snippet below. Square brackets denote a single array
 * element.
 *
 * ```
 * Node                                        Consequent array elements
 *
 * [leafCharCodesLength,  LEAF              ], [valueIndex], [charCode] * leafCharCodesLength
 * [charCode,             SINGLE_BRANCH     ], [nextNode]
 * [charCode,             SINGLE_BRANCH_LEAF], [valueIndex], [nextNode]
 * [childCharCodesLength, MULTI_BRANCH      ], ([charCode], [nextCursor]) * childCharCodesLength
 * [childCharCodesLength, MULTI_BRANCH_LEAF ], [valueIndex], ([charCode], [nextCursor]) * childCharCodesLength
 * ```
 *
 * - `leafCharCodesLength` is the length of {@linkcode Trie.leafCharCodes}.
 * - `childCharCodesLength` is the number of sub-tries in a trie.
 * - `valueIndex` is an index in {@linkcode ArrayTrie.values} that corresponds to a leaf node.
 * - `nextNode` is the next node that the search algorithm must process.
 * - `nextCursor` is an index in {@linkcode ArrayTrie.nodes} at which the search must proceed.
 *
 * @internal
 */
export const enum NodeType {
  LEAF,
  SINGLE_BRANCH,
  SINGLE_BRANCH_LEAF,
  MULTI_BRANCH,
  MULTI_BRANCH_LEAF,
}
