import {Trie} from './trie-types';

/**
 * Collects all trie leafs contained under the `trie` root.
 *
 * @param trie The trie root.
 * @param leafs The mutable in-out array of leafs that is populated during `trie` traversal.
 * @returns The array of leafs.
 *
 * @template T The type of values stored in a trie.
 */
export function trieCollect<T>(trie: Trie<T>, leafs: Trie<T>[] = []): Trie<T>[] {
  if (trie.isLeaf) {
    leafs.push(trie);
  }

  const nextCharCodes = trie.nextCharCodes;
  if (nextCharCodes !== null) {
    for (const charCode of nextCharCodes) {
      trieCollect(trie[charCode]!, leafs);
    }
  }

  return leafs;
}
