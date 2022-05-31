import {Trie} from './trie-types';
import {createTrie} from './createTrie';

/**
 * Sets a new key-value pair to the trie.
 *
 * @param trie The trie to update.
 * @param key The key of to add to the trie.
 * @param value The value to associate with the key.
 *
 * @template T The type of values stored in a trie.
 */
export function setTrie<T>(trie: Trie<T>, key: string, value: T): void {

  const keyLength = key.length;

  let i = 0;

  while (i < keyLength) {

    forkTrie(trie);

    if (!trie.isLeaf && trie.next === null) {
      break;
    }

    const next = trie.next ||= {};
    const charCode = key.charCodeAt(i++);
    const nextTrie = next[charCode];

    if (nextTrie !== undefined) {
      trie = nextTrie;
      continue;
    }

    const leaf = next[charCode] = createTrie<T>();
    leaf.prev = trie;
    leaf.key = trie.key;
    leaf.length = trie.length + 1;

    trie = leaf;
    break;
  }

  forkTrie(trie);

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
}

function forkTrie<T>(trie: Trie<T>): void {
  const leafCharCodes = trie.leafCharCodes;

  if (leafCharCodes === null) {
    return;
  }

  const leaf = createTrie<T>();

  if (leafCharCodes.length > 1) {
    leaf.leafCharCodes = leafCharCodes.slice(1);
  }

  leaf.prev = trie;
  leaf.key = trie.key;
  leaf.value = trie.value;
  leaf.length = trie.length;
  leaf.isLeaf = true;

  trie.next = {[leafCharCodes[0]]: leaf};
  trie.key = null;
  trie.value = undefined;
  trie.length -= leafCharCodes.length;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
