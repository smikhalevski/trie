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
export function collectTries<T>(trie: Trie<T>, leafs: Trie<T>[] = []): Trie<T>[] {
  if (trie.isLeaf) {
    leafs.push(trie);
  }

  const next = trie.next;

  if (next !== null) {
    for (const charCode in next) {
      collectTries(next[charCode]!, leafs);
    }
  }
  return leafs;
}
