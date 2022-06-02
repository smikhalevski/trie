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

  while (i < keyLength) {

    trieFork(trie);

    if (!trie.isLeaf && trie.last === null) {
      break;
    }

    const leafCharCode = key.charCodeAt(i++);
    const right = trie[leafCharCode];

    if (right !== undefined) {
      trie = right;
      continue;
    }

    const leaf = trieCreate<T>();
    leaf.charCode = leafCharCode;
    leaf.left = trie;
    leaf.key = trie.key;

    trie[leafCharCode] = leaf;

    if (trie.last === null) {
      leaf.prev = trie;
      leaf.next = trie.next;
      trie.next = leaf;
      trie.last = leaf;
    } else {
      leaf.prev = trie.last;
      leaf.next = trie.last.next;

      if (trie.last.next !== null) {
        trie.last.next.prev = leaf;
      }

      trie.last.next = leaf;
      trie.last = leaf;
    }

    trie = leaf;
    break;
  }

  trieFork(trie);

  if (i !== keyLength) {
    // noinspection JSMismatchedCollectionQueryUpdate
    const leafCharCodes: number[] = trie.leafCharCodes = [];

    while (i < keyLength) {
      leafCharCodes.push(key.charCodeAt(i++));
    }
  }

  trie.key = key;
  trie.value = value;
  trie.isLeaf = true;

  return trie;
}

function trieFork<T>(trie: Trie<T>): void {
  const leafCharCodes = trie.leafCharCodes;

  if (leafCharCodes === null) {
    return;
  }

  const leafCharCode = leafCharCodes[0];

  const leaf = trieCreate<T>();
  leaf.charCode = leafCharCode;
  leaf.left = trie;
  leaf.prev = trie;
  leaf.next = trie.next;
  leaf.key = trie.key;
  leaf.value = trie.value;
  leaf.isLeaf = true;

  if (trie.next !== null) {
    trie.next.prev = leaf;
  }

  if (leafCharCodes.length !== 1) {
    leaf.leafCharCodes = leafCharCodes.slice(1);
  }

  trie[leafCharCode] = leaf;
  trie.next = leaf;
  trie.last = leaf;
  trie.key = null;
  trie.value = undefined;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
