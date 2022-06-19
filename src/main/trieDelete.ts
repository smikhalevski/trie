import {Trie} from './trie-types';
import {trieSearch} from './trieSearch';

/**
 * Deletes the key and its corresponding value from the trie.
 *
 * @param trie The trie to update.
 * @param key The key to delete from the trie.
 * @returns `true` if the key was deleted or `false` if the key wasn't found in the trie.
 */
export function trieDelete(trie: Trie<any>, key: string): boolean {
  let leaf = trieSearch(trie, key)!;

  // Not found or not an exact match
  if (leaf === null || leaf.length !== key.length) {
    return false;
  }

  const parent = leaf.parent;

  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = null;

  // Leaf has children
  if (leaf.last !== null) {

    // Multiple children cannot be compacted
    if (leaf.size > 1) {
      return true;
    }

    // Maybe a single child can be compacted
    leaf = leaf.last;


  } else if (parent !== null) {
    // Leaf doesn't have children and has a parent

    --parent.size;
    parent[leaf.charCode] = undefined;
    leaf.parent = null;

    // Parent with a single leaf is also a leaf, or a trie root, or it was already compacted
    if (parent.size === 0) {
      parent.next = parent.last = null;
      return true;
    }

    if (parent.isLeaf || parent.size > 1) {
      // Parent cannot be compacted, since it's a leaf itself, or it has multiple children available after leaf deletion
      return true;
    }

    // Maybe a single remaining leaf sibling can be compacted
    leaf = parent.next!;

  } else {
    // Nothing to compact
    return true;
  }

  if (leaf.next !== null) {
    // Cannot be compacted since it is an intermediate node
    return true;
  }

  // Merge leaf into parent
  while (leaf.parent !== null) {
    const parent = leaf.parent;

    if (parent.isLeaf || parent.next!.size > 1) {
      // Cannot be compacted, since parent is a leaf itself, or parent has multiple leafs
      break;
    }

    // Parent is a non-leaf node with a single child, so merge leaf into parent
    const leafCharCodes = leaf.leafCharCodes || [];
    leafCharCodes.unshift(leaf.charCode);

    --parent.size;
    parent[leaf.charCode] = undefined;
    parent.value = leaf.value;
    parent.next = parent.last = leaf.parent = null;
    parent.isLeaf = true;
    parent.leafCharCodes = leafCharCodes;

    leaf = parent;
  }
  return true;
}
