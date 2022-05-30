import {Trie} from './trie-types';
import {findTrie} from './findTrie';

export function deleteTrie(trie: Trie<any>, key: string): boolean {
  let leaf = findTrie(trie, key, 0)!;

  if (leaf === null || leaf.key !== key) {
    return false;
  }

  leaf.key = null;
  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = null;

  const {prev, next} = leaf;

  if (next !== null) {

    // Multiple next branches cannot be compacted
    if (next.length > 1) {
      return true;
    }

    // Maybe a single next can be compacted
    leaf = next[0];
  } else if (prev !== null) {

    // Prev always includes leaf under next
    const arr = prev.next!;

    // Prev with a single leaf if also a leaf or a trie root, otherwise it was already compacted
    if (arr.length === 1) {
      prev.next = null;
      prev.nextCharCodes = null;
      return true;
    }

    const i = arr.indexOf(leaf);
    arr.splice(i, 1);
    prev.nextCharCodes!.splice(i, 1);

    if (prev.isLeaf || arr.length !== 1) {
      // Prev cannot be compacted, since it's a leaf itself, or it has multiple nexts available after leaf deletion
      return true;
    }

    // Maybe a single remaining leaf sibling can be compacted
    leaf = arr[0];

  } else {
    // Nothing to compact
    return true;
  }

  if (leaf.next !== null) {
    // Cannot be compacted since it is an intermediate node
    return true;
  }

  // Merge leaf into prev
  while (leaf.prev !== null) {
    const prev = leaf.prev;

    if (prev.isLeaf || prev.next!.length > 1) {
      // Cannot be compacted, since prev is a leaf itself, or prev has multiple leafs
      break;
    }

    // Prev is a non-leaf node with a single next, so merge leaf into prev
    const leafCharCodes = leaf.leafCharCodes || [];

    // Prev always includes leaf under next, so nextCharCodes is always available
    leafCharCodes.unshift(prev.nextCharCodes![0]);

    prev.key = leaf.key;
    prev.value = leaf.value;
    prev.length = leaf.length;
    prev.next = null;
    prev.nextCharCodes = null;
    prev.isLeaf = true;
    prev.leafCharCodes = leafCharCodes;

    leaf = prev;
  }
  return true;
}
