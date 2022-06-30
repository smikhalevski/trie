import { Trie } from './trie-types';

/**
 * Deletes the leaf from its trie.
 *
 * @param leaf The leaf to delete.
 */
export function trieDelete(leaf: Trie<any> | null): void {
  if (leaf === null || !leaf.isLeaf) {
    return;
  }

  for (let parent: Trie<any> | null = leaf; parent !== null; parent = parent.parent) {
    parent.suggestions = null;
  }

  const parent = leaf.parent;
  const next = leaf.next;
  const last = leaf.last;

  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = leaf.key = null;

  if (last !== null) {
    // There's at least one child (1)

    if (last !== next) {
      // A leaf with multiple children cannot be compacted (1.1)
      return;
    }

    // Maybe a single child can be compacted (1.2)
    leaf = last;
  } else if (parent !== null) {
    // There are no children but parent exists (2)

    // Parent exists and can be a prev
    const prev = leaf.prev!;

    parent[leaf.charCode] = undefined;
    leaf.charCode = -1;
    leaf.parent = leaf.prev = leaf.next = null;

    let parentLast = parent.last;

    if (parentLast === leaf) {
      // Update of parent last pointer is required

      if (parent.next === leaf) {
        parentLast = parent.last = null;
      } else {
        // Lookup the closest prev that is also a child of parent
        parentLast = prev;
        while (parentLast.parent !== parent) {
          // Parent is reached before the prev becomes null (2.1)
          parentLast = parentLast.prev!;
        }
        parent.last = parentLast;
      }
    }

    // Re-establish list links
    if (next !== null) {
      next.prev = prev;
    }
    prev.next = next;

    if (parentLast === null) {
      // Maybe a parent without remaining children can be compacted (2.2)
      leaf = parent;
    } else if (parentLast === parent.next) {
      // Maybe a single remaining parent leaf sibling can be compacted (2.3)
      leaf = parentLast;
    } else {
      // Parent has multiple children remaining (2.4)
      return;
    }
  } else {
    // Leaf is a root (3)
    return;
  }

  if (leaf.last !== null) {
    // Cannot be compacted since it is an intermediate node
    return;
  }

  // Recursively merge the leaf with the parent, if the parent is a non-leaf node with a single child
  for (
    let nextParent = leaf.parent, parent = nextParent;
    parent !== null && !parent.isLeaf && parent.next === parent.last;
    parent = nextParent
  ) {
    nextParent = parent.parent;
    if (nextParent === null) {
      break;
    }

    const parentCharCode = parent.charCode;
    const parentPrev = parent.prev;
    const leafCharCode = leaf.charCode;

    nextParent[parentCharCode] = leaf;
    if (nextParent.last === parent) {
      nextParent.last = leaf;
    }

    if (parentPrev !== null) {
      parentPrev.next = leaf;
    }

    leaf.charCode = parentCharCode;
    leaf.parent = nextParent;
    leaf.prev = parentPrev;

    const leafCharCodes = (leaf.leafCharCodes ||= []);
    leafCharCodes.unshift(leafCharCode);

    parent[leafCharCode] = undefined;
    parent.charCode = -1;
    parent.parent = parent.prev = parent.next = parent.last = parent.suggestions = null;
  }

  return;
}
