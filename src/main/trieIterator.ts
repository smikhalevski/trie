import { Trie } from './trie-types';

/**
 * Creates an iterator over leafs of the trie. Leafs are walked over in the same order as their prefixes were added.
 *
 * @param trie The trie to iterate over.
 * @returns The iterator over leafs of the trie.
 *
 * @template T The type of values stored in a trie.
 */
export function trieIterator<T>(trie: Trie<T>): IterableIterator<Trie<T>> {
  return (function iterator(): IterableIterator<Trie<T>> {
    let next: Trie<T> | null = trie;

    return {
      [Symbol.iterator]: iterator,

      next() {
        while (next !== null) {
          const value = next;
          next = next.next;

          if (value.isLeaf) {
            return { value, done: false };
          }
        }
        return { value: undefined, done: true };
      },
    };
  })();
}
