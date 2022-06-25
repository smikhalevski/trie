import { Trie } from './trie-types';

/**
 * Creates a compressed trie data structure that supports doubly linked list navigation.
 *
 * @template T The type of values stored in a trie.
 * @see {@link https://en.wikipedia.org/wiki/Trie#Compressed_tries Compressed trie on Wikipedia}
 * @see {@link https://en.wikipedia.org/wiki/Doubly_linked_list Doubly linked list on Wikipedia}
 */
export function trieCreate<T>(): Trie<T> {
  return {
    charCode: -1,
    parent: null,
    prev: null,
    next: null,
    last: null,
    key: null,
    value: undefined,
    isLeaf: false,
    leafCharCodes: null,
    suggestions: null,
  };
}
