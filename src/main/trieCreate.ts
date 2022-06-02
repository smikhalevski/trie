import {Trie} from './trie-types';

/**
 * Creates a compressed trie data structure.
 *
 * @template T The type of values stored in a trie.
 * @see {@link https://en.wikipedia.org/wiki/Trie#Compressed_tries Compressed tries on Wikipedia}
 */
export function trieCreate<T>(): Trie<T> {
  return {
    charCode: -1,
    left: null,
    prev: null,
    next: null,
    last: null,
    key: null,
    value: undefined,
    isLeaf: false,
    leafCharCodes: null,
  };
}
