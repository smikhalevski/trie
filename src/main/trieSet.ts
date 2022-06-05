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

      // Clear leafs cache
      trie.leafs = null;

      const keyCharCode = key.charCodeAt(i++);
      const trieLast = trie.last;

      // Links are established between last → leaf → last.next if the leaf insertion would be required
      let last = trie;

      if (trieLast !== null) {

        const child = trie[keyCharCode];
        if (child !== undefined) {
          trie = child;
          continue;
        }

        // Find the deepest last trie
        last = trieLast;
        while (last.last !== null) {
          last = last.last;
        }
      }

      // Append leaf and restore links
      const leaf = trieCreate<T>();
      leaf.charCode = keyCharCode;
      leaf.parent = trie;
      leaf.prev = last;

      const lastNext = leaf.next = last.next;
      if (lastNext !== null) {
        lastNext.prev = leaf;
      }

      trie = trie[keyCharCode] = trie.last = last.next = leaf;
      break;
    }
  }

  if (i === keyLength) {
    trieFork(trie);
  } else {
    trie.leafCharCodes = [];

    while (i < keyLength) {
      trie.leafCharCodes.push(key.charCodeAt(i++));
    }
  }

  trie.value = value;
  trie.isLeaf = true;
  trie.leafs = null;

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

  if (trieLeafCharCodes.length > 0) {
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
