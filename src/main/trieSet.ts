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

  if (keyLength > 0 && trie.parent === null && trie.last === null) {
    // The root node may contain an empty key only

    const keyCharCode = key.charCodeAt(0);

    const leaf = trieCreate<T>();
    leaf.charCode = keyCharCode;
    leaf.parent = leaf.prev = trie;

    trie.suggestions = null;
    trie = trie[keyCharCode] = trie.next = trie.last = leaf;
    ++i;
  }

  // Find the trie with the longest common prefix
  while (i < keyLength) {
    trie = trieFork(trie);
    trie.suggestions = null;

    const keyCharCode = key.charCodeAt(i);

    const child = trie[keyCharCode];
    if (child === undefined) {
      break;
    }
    trie = child;
    ++i;
  }

  if (i === keyLength) {
    trie = trieFork(trie);
    trie.leafCharCodes = null;

  } else {
    const trieLast = trie.last;

    if (trieLast !== null || trie.isLeaf) {
      const keyCharCode = key.charCodeAt(i);

      const leaf = trieCreate<T>();
      leaf.charCode = keyCharCode;
      leaf.parent = trie;

      if (trieLast !== null) {
        let prev = trieLast;
        while (prev.last !== null) {
          prev = prev.last;
        }
        leaf.prev = prev;
        leaf.next = prev.next;

        if (prev.next !== null) {
          prev.next.prev = leaf;
        }
        prev.next = leaf;
      } else {
        leaf.prev = trie;
        leaf.next = trie.next;

        if (trie.next !== null) {
          trie.next.prev = leaf;
        }
        trie.next = leaf;
      }

      trie = trie[keyCharCode] = trie.last = leaf;
      ++i;
    }

    if (i < keyLength) {
      trie.leafCharCodes = [];

      while (i < keyLength) {
        trie.leafCharCodes.push(key.charCodeAt(i));
        ++i;
      }
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
