import {Trie} from './trie-types';
import {trieGet} from './trieGet';

/**
 * Deletes the key and its corresponding value from the trie.
 *
 * @param trie The trie to update.
 * @param key The key to delete from the trie.
 * @returns `true` if the key was deleted or `false` if the key wasn't found in the trie.
 */
export function trieDelete(trie: Trie<any>, key: string): boolean {
  let leaf = trieGet(trie, key);
  if (leaf === null) {
    // Not found or not an exact match
    return false;
  }

  for (let parent = leaf.parent; parent !== null; parent = parent.parent) {
    parent.suggestions = null;
  }

  const {parent, last} = leaf;

  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = leaf.key = null;

  if (last !== null) {

    // If there's last then there's at least one child
    if (leaf.next !== last) {
      // Multiple children cannot be compacted
      return true;
    }

    // Maybe a single child can be compacted
    leaf = last;

  } else if (parent !== null) {

    parent[leaf.charCode] = undefined;

    // Leaf is removed from the trie
    leaf.charCode = -1;
    leaf.parent = null;

    // Parent with a single leaf is also a leaf, or a trie root, or it was already compacted
    if (parent.next === parent.last) {
      parent.next = leaf.next;
      parent.last = leaf.next = null;
      return true;
    }


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


    if (parent.isLeaf || parent.last !== parent.next) {
      return true;
    }

    // Maybe a single remaining sibling of leaf can be compacted
    leaf = parent.next!;

  } else {
    // Leaf is a root, nothing to compact
    return true;
  }

  if (leaf.next !== null) {
    // Cannot be compacted since it is an intermediate node
    return true;
  }

  // Recursively merge the leaf into the parent, if the parent is a non-leaf node with a single child
  for (let parent = leaf.parent; parent !== null && !parent.isLeaf && parent.next === parent.last; leaf = parent, parent = parent.parent) {

    const leafCharCodes = leaf.leafCharCodes || [];
    leafCharCodes.unshift(leaf.charCode);


    // PRESERVE leaf AS LEAF, DELETE AND RESET A PARENT


    parent[leaf.charCode] = undefined;
    parent.key = leaf.key;
    parent.value = leaf.value;
    parent.next = leaf.next;
    parent.last = null;
    parent.isLeaf = true;
    parent.leafCharCodes = leafCharCodes;

    resetTrie(leaf);
  }
  return true;
}

function resetTrie(trie: Trie<any>): void {
  trie.charCode = -1;
  trie.parent = trie.next = trie.last = trie.key = trie.leafCharCodes = trie.suggestions = null;
  trie.value = undefined;
  trie.isLeaf = false;
}
