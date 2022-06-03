import {Trie} from './trie-types';
import {trieCreate} from './trieCreate';

/**
 * Sets a new key-value pair to the trie.
 *
 * @param trie The trie to update.
 * @param key The key of to add to the trie.
 * @param value The value to associate with the key.
 * @returns The leaf to which the value was set.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSet<T>(trie: Trie<T>, key: string, value: T): Trie<T> {
  const keyLength = key.length;

  let i = 0;

  if (trie.last !== null || trie.isLeaf) {

    while (i < keyLength) {

      trieFork(trie);

      const keyCharCode = key.charCodeAt(i++);
      const trieLast = trie.last;

      if (trieLast !== null) {

        // Try to proceed to the consequent child
        const child = trie[keyCharCode];
        if (child !== undefined) {
          trie = child;
          continue;
        }

        // Reached a trie that has children but doesn't have a required consequent child, the trie has children
        const leaf = trieCreate<T>();
        leaf.charCode = keyCharCode;
        leaf.parent = trie;
        leaf.prev = trieLast;
        leaf.next = trieLast.next;

        if (trieLast.next) {
          trieLast.next.prev = leaf;
        }

        trie = trie[keyCharCode] = trie.last = trieLast.next = leaf;
        break;

      } else {
        // Reached the leaf that cannot be forked, the trie has no children, so append a new leaf
        const leaf = trieCreate<T>();
        leaf.charCode = keyCharCode;
        leaf.parent = leaf.prev = trie;
        leaf.next = trie.next;

        trie = trie[keyCharCode] = trie.next = trie.last = leaf;
        break;
      }
    }
  }

  if (i === keyLength) {
    // Found the trie that matches the key exactly, ensure the current trie.leafCharCodes aren't overwritten
    trieFork(trie);
  } else {
    trie.leafCharCodes = [];

    while (i < keyLength) {
      trie.leafCharCodes.push(key.charCodeAt(i++));
    }
  }

  trie.value = value;
  trie.isLeaf = true;

  return trie;
}

/**
 * Forks a leaf from a trie (most trie properties are omitted for clarity):
 * ```
 * {leafCharCodes: [A, B]} → {A: {leafCharCodes: [B]}}
 * ```
 *
 * @param trie The trie to fork.
 */
function trieFork<T>(trie: Trie<T>): void {

  const trieLeafCharCodes = trie.leafCharCodes;
  if (trieLeafCharCodes === null) {
    // Nothing to fork
    return;
  }

  // leafCharCodes always contains at least one element
  const charCode = trieLeafCharCodes.shift()!;
  const trieNext = trie.next;

  // Create a leaf and attach it to the trie
  const leaf = trieCreate<T>();
  leaf.charCode = charCode;
  leaf.parent = leaf.prev = trie;
  leaf.next = trieNext;
  leaf.value = trie.value;
  leaf.isLeaf = true;

  if (trieLeafCharCodes.length !== 0) {
    leaf.leafCharCodes = trieLeafCharCodes;
  }

  if (trieNext !== null) {
    trieNext.prev = leaf;
  }

  // The trie is no longer a leaf
  trie[charCode] = trie.next = trie.last = leaf;
  trie.value = undefined;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
