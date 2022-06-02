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

    if (!trie.isLeaf && !trie.hasContinuation) {
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
    // leaf.length = trie.length + 1;

    trie[leafCharCode] = leaf;
    trie.hasContinuation = true;

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
  // trie.length = i;

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
  leaf.key = trie.key;
  leaf.value = trie.value;
  leaf.isLeaf = true;
  // leaf.length = trie.length;

  if (leafCharCodes.length !== 1) {
    leaf.leafCharCodes = leafCharCodes.slice(1);
  }

  trie[leafCharCode] = leaf;
  trie.hasContinuation = true;
  trie.key = null;
  trie.value = undefined;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
  // trie.length -= leafCharCodes.length;
}
