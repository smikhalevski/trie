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

    if (!trie.isLeaf && trie.nextCharCodes === null) {
      break;
    }

    const charCode = key.charCodeAt(i++);
    const next = trie[charCode];

    if (next !== undefined) {
      trie = next;
      continue;
    }

    const nextCharCodes = trie.nextCharCodes ||= [];

    nextCharCodes.push(charCode);

    const leaf = trie[charCode] = trieCreate<T>();
    leaf.prev = trie;
    leaf.key = trie.key;
    leaf.length = trie.length + 1;

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
  trie.length = i;
  trie.isLeaf = true;

  return trie;
}

function trieFork<T>(trie: Trie<T>): void {
  const leafCharCodes = trie.leafCharCodes;

  if (leafCharCodes === null) {
    return;
  }

  const leaf = trieCreate<T>();
  const leafCharCode = leafCharCodes[0];

  leaf.prev = trie;
  leaf.key = trie.key;
  leaf.value = trie.value;
  leaf.length = trie.length;
  leaf.isLeaf = true;

  if (leafCharCodes.length > 1) {
    leaf.leafCharCodes = leafCharCodes.slice(1);
  }

  trie[leafCharCode] = leaf;
  trie.nextCharCodes = [leafCharCode];
  trie.key = null;
  trie.value = undefined;
  trie.length -= leafCharCodes.length;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
