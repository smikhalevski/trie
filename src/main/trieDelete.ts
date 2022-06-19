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
  let leaf = trieSearch(trie, key);

  if (leaf === null || leaf.length !== key.length) {
    // Not found or not an exact match
    return false;
  }

  // Clear suggestions
  for (let parent = leaf.parent; parent !== null; parent = parent.parent) {
    parent.leafs = null;
  }

  const {parent, last} = leaf;

  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = null;

  if (last !== null) {

    // If there's last then there's at least one child
    if (leaf.size !== 1) {
      // Multiple children cannot be compacted
      return true;
    }

    // Maybe a single child can be compacted
    leaf = last;

  } else if (parent !== null) {

    parent[leaf.charCode] = undefined;
    parent.size--;

    // Leaf is removed from the trie
    leaf.charCode = -1;
    leaf.parent = null;

    // Parent with a single leaf is also a leaf, or a trie root, or it was already compacted
    if (parent.size === 0) {
      parent.next = leaf.next;
      parent.last = leaf.next = null;
      return true;
    }

    if (parent.isLeaf || parent.size !== 1) {
      // Parent cannot be compacted, since it's a leaf, or parent has multiple children remaining after leaf deletion

      let last = parent.last;
      for (let prev = parent, next = prev.next; next !== null; prev = next, next = prev.next) {
        if (next === leaf) {
          prev.next = leaf.next;
          break;
        }
        if (next.parent === parent) {
          last = next;
        }
      }

      if (parent.next === leaf) {
        parent.next = leaf.next;
      }

      parent.last = last;

      leaf.next = null;

      return true;
    }

    // Maybe a single remaining sibling of leaf can be compacted
    leaf = parent.next === leaf ? parent.next = parent.last! : parent.last = parent.next!;

  } else {
    // Leaf is a root, nothing to compact
    leaf.length = 0;
    return true;
  }

  if (leaf.next !== null) {
    // Cannot be compacted since it is an intermediate node
    return true;
  }

  // Merge leaf into parent
  for (let parent = leaf.parent; parent !== null && !parent.isLeaf && parent.next!.size !== 1; leaf = parent, parent = parent.parent) {

    // Parent is a non-leaf node with a single child, so merge leaf into parent
    const leafCharCodes = leaf.leafCharCodes || [];
    leafCharCodes.unshift(leaf.charCode);

    parent[leaf.charCode] = undefined;
    parent.size--;
    parent.length = leaf.length;
    parent.value = leaf.value;
    parent.next = leaf.next;
    parent.last = leaf.parent = leaf.next = leaf.last = null;
    parent.isLeaf = true;
    parent.leafCharCodes = leafCharCodes;

    leaf.charCode = -1;
  }
  return true;
}
