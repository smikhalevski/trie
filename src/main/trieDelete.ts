import {Trie} from './trie-types';

/**
 * Deletes leaf of the trie.
 *
 * @param leaf The leaf to delete.
 */
export function trieDelete(leaf: Trie<any> | null): void {
  for (let parent = leaf; parent !== null; parent = parent.parent) {
    parent.suggestions = null;
  }

  if (leaf === null) {
    return;
  }

  const leafParent = leaf.parent;
  const leafLast = leaf.last;

  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = leaf.key = null;

  if (leafLast !== null) {
    // There's at least one child

    if (leaf.next !== leafLast) {
      // Multiple children cannot be compacted
      return;
    }

    // Maybe a single child can be compacted
    leaf = leafLast;

  } else if (leafParent !== null) {
    // There are no children

    leafParent[leaf.charCode] = undefined;
    leaf.charCode = -1;
    leaf.parent = null;

    const leafPrev = leaf.prev!;
    const leafNext = leaf.next;

    if (leafNext !== null) {
      leafNext.prev = leafPrev;
    }

    let leafParentLast = leafParent.last!;

    if (leafParentLast === leaf) {

      if (leafParent.next === leaf) {
        // Parent with a single leaf is also a leaf or a trie root
        leafParent.next = leafNext;
        leafParent.last = leaf.prev = leaf.next = null;
        return;
      }

      leafParentLast = leafPrev;
      while (leafParentLast.parent !== leafParent) {
        leafParentLast = leafParentLast.parent!;
      }
      leafParent.last = leafParentLast;
    }

    leafPrev.next = leafNext;

    if (leafParent.isLeaf || leafParentLast !== leafParent.next) {
      // Parent is a leaf or has multiple children remaining
      return;
    }

    // Maybe a single remaining leaf sibling can be compacted
    leaf = leafParentLast;

  } else {
    // Leaf is a root
    return;
  }

  if (leaf.next !== null) {
    // Cannot be compacted since it is an intermediate node
    return;
  }

  // Recursively merge the leaf with the parent, if the parent is a non-leaf node with a single child
  for (let nextParent = leaf.parent, parent = nextParent; parent !== null && !parent.isLeaf && parent.next === parent.last; parent = nextParent) {

    nextParent = parent.parent;

    if (nextParent === null) {
      break;
    }

    const charCode = leaf.charCode;
    const leafCharCodes = leaf.leafCharCodes ||= [];
    leafCharCodes.unshift(charCode);

    if (nextParent.last === parent) {
      nextParent.last = leaf;
    }
    nextParent[parent.charCode] = leaf;

    parent[charCode] = undefined;

    if (parent.prev !== null) {
      parent.prev.next = leaf;
    }

    leaf.charCode = parent.charCode;
    leaf.prev = parent.prev;
    leaf.parent = parent.parent;

    parent.charCode = -1;
    parent.parent = parent.prev = parent.next = parent.last = parent.suggestions = null;
  }
  return;
}
