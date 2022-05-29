import {Trie} from './trie-types';
import {createTrie} from './createTrie';

/**
 * Sets a new word-value pair to the trie.
 *
 * @param trie The trie to update.
 * @param word The word of to add to the trie.
 * @param value The value to associate with the word.
 *
 * @template T The type of values stored in a trie.
 */
export function setTrie<T>(trie: Trie<T>, word: string, value: T): void {

  const wordLength = word.length;

  let i = 0;

  forking: while (i < wordLength) {

    forkTrie(trie);

    if (!trie.isLeaf && trie.next === null) {
      break;
    }

    const next = trie.next ||= [];
    const nextCharCodes = trie.nextCharCodes ||= [];

    const charCode = word.charCodeAt(i++);
    const j = nextCharCodes.indexOf(charCode);

    if (j !== -1) {
      trie = next[j];
      continue;
    }

    const leaf = createTrie<T>();
    leaf.prev = trie;
    leaf.word = trie.word;
    leaf.length = trie.length + 1;

    trie = leaf;

    // Keep next* sorted in ascending order
    for (let k = 0; k < nextCharCodes.length; ++k) {
      if (nextCharCodes[k] > charCode) {
        next.splice(k, 0, leaf);
        nextCharCodes.splice(k, 0, charCode);
        break forking;
      }
    }

    next.push(leaf);
    nextCharCodes.push(charCode);
    break;
  }

  forkTrie(trie);

  if (i !== wordLength) {
    // noinspection JSMismatchedCollectionQueryUpdate
    const leafCharCodes: number[] = trie.leafCharCodes = [];

    while (i < wordLength) {
      leafCharCodes.push(word.charCodeAt(i));
      ++i;
    }
  }

  trie.word = word;
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
  const leafCharCode = leafCharCodes[0];

  trie.next = [leaf];
  trie.nextCharCodes = [leafCharCode];

  if (leafCharCodes.length > 1) {
    leaf.leafCharCodes = leafCharCodes.slice(1);
  }

  leaf.prev = trie;
  leaf.word = trie.word;
  leaf.value = trie.value;
  leaf.length = trie.length;
  leaf.isLeaf = true;

  trie.word = null;
  trie.value = undefined;
  trie.length -= leafCharCodes.length;
  trie.isLeaf = false;
  trie.leafCharCodes = null;
}
