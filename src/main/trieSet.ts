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

  // Find the trie with the longest common prefix
  while (i < keyLength) {

    trie = trieFork(trie);
    trie.suggestions = null;

    const keyCharCode = key.charCodeAt(i++);
    const trieLast = trie.last;

    // Links between prev → leaf → prev.next would be established for the new leaf
    let prev = trie;

    if (trieLast !== null) {

      const child = trie[keyCharCode];
      if (child !== undefined) {
        trie = child;
        continue;
      }

      // Find the latest trie
      prev = trieLast;
      while (prev.last !== null) {
        prev = prev.last;
      }
    }

    const prevNext = prev.next;

    // Append the new leaf and establish links
    const leaf = trieCreate<T>();
    leaf.charCode = keyCharCode;
    leaf.parent = trie;
    leaf.prev = prev;
    leaf.next = prevNext;

    if (prevNext !== null) {
      prevNext.prev = leaf;
    }

    trie = trie[keyCharCode] = trie.last = prev.next = leaf;
    break;
  }

  if (i === keyLength) {
    trie = trieFork(trie);
  } else {
    trie.leafCharCodes = [];

    while (i < keyLength) {
      trie.leafCharCodes.push(key.charCodeAt(i++));
    }
  }

  trie.key = key;
  trie.value = value;
  trie.isLeaf = true;
  trie.suggestions = null;

  return trie;
}

/**
 * Inserts a parent for a trie (most trie properties are omitted for clarity):
 *
 * ```
 * {A: <trie>{leafCharCodes: [B, C]}}
 * ↓
 * {A: {B: <trie>{leafCharCodes: [C]}}}
 * ```
 *
 * @param trie The trie to fork.
 */
function trieFork<T>(trie: Trie<T>): Trie<T> {

  const trieLeafCharCodes = trie.leafCharCodes;
  if (trieLeafCharCodes === null) {
    return trie;
  }

  // Trie always has a parent when fork is requested
  const trieCharCode = trie.charCode;
  const trieParent = trie.parent!;
  const triePrev = trie.prev!;

  const charCode = trieLeafCharCodes[0];

  const parent = trieCreate<T>();
  parent[charCode] = parent.next = parent.last = trie;
  parent.charCode = trieCharCode;
  parent.parent = trieParent;
  parent.prev = triePrev;

  trie.charCode = charCode;
  trieParent[trieCharCode] = triePrev.next = trie.parent = trie.prev = parent;

  if (trieParent.last === trie) {
    trieParent.last = parent;
  }

  if (trieLeafCharCodes.length === 1) {
    trie.leafCharCodes = null;
  } else {
    trieLeafCharCodes.shift();
  }

  return parent;
}
