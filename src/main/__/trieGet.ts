import {Trie} from '../trie-types';

/**
 * Returns the leaf that describes the key.
 *
 * @param trie The trie root.
 * @param key The key to retrieve.
 * @returns The leaf that holds the value for `key` or `undefined` if there's no such leaf.
 *
 * @template T The type of values stored in a trie.
 */
export function trieGet<T>(trie: Trie<T>, key: string): Trie<T> | undefined {
  return;
  // const keyLength = key.length;
  //
  // let i = 0;
  //
  // while (i < keyLength) {
  //
  //   const next = trie.next;
  //   if (next === null) {
  //     break;
  //   }
  //
  //   const nextTrie = next[key.charCodeAt(i)];
  //   if (nextTrie === undefined) {
  //     break;
  //   }
  //
  //   trie = nextTrie;
  //   ++i;
  // }
  //
  // if (trie.isLeaf && trie.length === keyLength) {
  //
  //   const leafCharCodes = trie.leafCharCodes;
  //   if (leafCharCodes === null) {
  //     return trie;
  //   }
  //
  //   const leafCharCodesLength = leafCharCodes.length;
  //   let j = 0;
  //   while (j < leafCharCodesLength && key.charCodeAt(i) === leafCharCodes[j]) {
  //     ++j;
  //     ++i;
  //   }
  //   if (j === leafCharCodesLength) {
  //     return trie;
  //   }
  // }
}
