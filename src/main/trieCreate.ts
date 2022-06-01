import {Trie} from './trie-types';

/**
 * Creates a compressed trie data structure.
 *
 * @template T The type of values stored in a trie.
 * @see {@link https://en.wikipedia.org/wiki/Trie#Compressed_tries Compressed tries on Wikipedia}
 */
export function trieCreate<T>(): Trie<T> {
  return {
    prev: null,
    next: null,
    key: null,
    value: undefined,
    length: 0,
    isLeaf: false,
    leafCharCodes: null,
  };
}
