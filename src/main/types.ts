/**
 * The compressed trie data structure.
 *
 * @template Value The value stored in a trie.
 */
export interface Node<Value = any> {
  /**
   * Mapping from char code to a corresponding child node.
   */
  [charCode: number]: Node<Value> | undefined;

  /**
   * The char code in {@link parent} that is associated with this node, or -1 if node has no {@link parent}.
   */
  charCode: number;

  /**
   * The preceding node or `null` if this node is a root.
   */
  parent: Node<Value> | null;

  /**
   * The previous node in the linked list of all nodes in the node.
   */
  prev: Node<Value> | null;

  /**
   * The next node in the linked list of all nodes in the node.
   */
  next: Node<Value> | null;

  /**
   * The last child of this node.
   */
  last: Node<Value> | null;

  /**
   * The key that the leaf node represents or `null` for a non-leaf node.
   */
  key: string | null;

  /**
   * The value set to the node or `undefined` for a non-leaf node. Use {@link isLeaf} to distinguish between leaf
   * and non-leaf nodes.
   */
  value: Value | undefined;

  /**
   * `true` if the node is a leaf and has a {@link value}.
   */
  isLeaf: boolean;

  /**
   * The list of remaining chars of the leaf's key.
   */
  leafCharCodes: number[] | null;

  /**
   * The list of all leafs of this node. A memoization mechanism, populated by {@link suggestNodes} and cleaned by
   * {@link setValue} and {@link deleteNode}.
   */
  suggestions: Node<Value>[] | null;
}
