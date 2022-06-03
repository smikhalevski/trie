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

  if (trie.isLeaf || trie.last !== null) {

    while (i < keyLength) {
      const leafCharCode = key.charCodeAt(i++);

      trieFork(trie);

      if (trie.last !== null) {
        const right = trie[leafCharCode];

        if (right !== undefined) {
          trie = right;
          continue;
        }
      }

      const leaf = trieCreate<T>();
      leaf.charCode = leafCharCode;
      leaf.parent = trie;
      leaf.key = trie.key;

      const trieLast = trie.last;

      if (trieLast !== null) {
        const trieLastNext = trieLast.next;

        leaf.prev = trieLast;
        leaf.next = trieLastNext;

        if (trieLastNext !== null) {
          trieLastNext.prev = leaf;
        }

        trieLast.next = leaf;
      } else {
        leaf.prev = trie;
        leaf.next = trie.next;
        trie.next = leaf;
      }

      trie[leafCharCode] = leaf;
      trie.last = leaf;

      trie = leaf;
      break;
    }

    trieFork(trie);
  }

  trie.key = key;
  trie.value = value;
  trie.isLeaf = true;

  // Put remaining key chars into a leafCharCodes array
  if (i !== keyLength) {
    // noinspection JSMismatchedCollectionQueryUpdate
    const leafCharCodes: number[] = trie.leafCharCodes = [];

    while (i < keyLength) {
      leafCharCodes.push(key.charCodeAt(i++));
    }
  }

  return trie;
}

/**
 * Forks a leaf from a trie (most trie properties are omitted for clarity):
 * ```
 * {leafCharCodes: [A, B]} → {A: {leafCharCodes: [B]}}
 * ```
 *
 * @param trie The trie to fork.
 * @returns The forked leaf or the original trie.
 */
function trieFork<T>(trie: Trie<T>): void {
  const trieLeafCharCodes = trie.leafCharCodes;

  if (trieLeafCharCodes === null) {
    // Nothing to fork
    return;
  }

  const trieNext = trie.next;
  const leafCharCode = trieLeafCharCodes[0];

  // Create a leaf and attach it to the trie
  const leaf = trieCreate<T>();
  leaf.charCode = leafCharCode;
  leaf.parent = trie;
  leaf.prev = trie;
  leaf.next = trieNext;
  leaf.key = trie.key;
  leaf.value = trie.value;
  leaf.isLeaf = true;

  if (trieLeafCharCodes.length !== 1) {
    leaf.leafCharCodes = trieLeafCharCodes.slice(1);
  }

  if (trieNext !== null) {
    trieNext.prev = leaf;
  }

  // The trie is no longer a leaf
  trie[leafCharCode] = leaf;
  trie.next = leaf;
  trie.last = leaf;
  trie.key = null;
  trie.value = undefined;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
