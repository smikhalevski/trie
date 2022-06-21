import {Trie} from './trie-types';

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
            return {value, done: false};
          }
        }
        return {value: undefined!, done: true};
      },
    };
  })();
}
