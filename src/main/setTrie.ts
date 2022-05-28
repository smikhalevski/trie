import {Trie} from './trie-types';
import {createTrie} from './createTrie';

/**
 * Sets a new key-value pair to the trie node.
 *
 * @param trie The trie to update.
 * @param key The key of to add to the {@link Trie `Trie`} object.
 * @param value The value to associate with the key.
 */
export function setTrie<T>(trie: Trie<T>, key: string, value: T): void {

  const keyLength = key.length;

  let i = 0;

  keyLoop: while (i < keyLength) {

    forkTrie(trie);

    if (!trie.isLeaf && trie.next === null) {
      break;
    }

    const next = trie.next ||= [];
    const nextCharCodes = trie.nextCharCodes ||= [];

    const charCode = key.charCodeAt(i++);
    const j = nextCharCodes.indexOf(charCode);

    if (j !== -1) {
      trie = next[j];
      continue;
    }

    const leafNode = createTrie<T>();
    leafNode.prev = trie;
    leafNode.key = trie.key;
    leafNode.length = trie.length + 1;

    trie = leafNode;

    // Keep next* sorted in ascending order
    for (let k = 0; k < nextCharCodes.length; ++k) {
      if (nextCharCodes[k] > charCode) {
        next.splice(k, 0, leafNode);
        nextCharCodes.splice(k, 0, charCode);
        break keyLoop;
      }
    }

    next.push(leafNode);
    nextCharCodes.push(charCode);
    break;
  }

  forkTrie(trie);

  if (i !== keyLength) {
    // noinspection JSMismatchedCollectionQueryUpdate
    const leafCharCodes: number[] = trie.leafCharCodes = [];

    while (i < keyLength) {
      leafCharCodes.push(key.charCodeAt(i));
      ++i;
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

  const leafTrie = createTrie<T>();
  const charCode = leafCharCodes[0];

  trie.next = [leafTrie];
  trie.nextCharCodes = [charCode];

  if (leafCharCodes.length > 1) {
    leafTrie.leafCharCodes = leafCharCodes.slice(1);
  }

  leafTrie.prev = trie;
  leafTrie.key = trie.key;
  leafTrie.value = trie.value;
  leafTrie.length = trie.length;
  leafTrie.isLeaf = true;

  trie.key = null;
  trie.value = undefined;
  trie.length -= leafCharCodes.length;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
