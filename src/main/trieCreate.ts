import {Trie} from './trie-types';

/**
 * Creates a compressed trie data structure.
 *
 * @template T The type of values stored in a trie.
 * @see {@link https://en.wikipedia.org/wiki/Trie#Compressed_tries Compressed tries on Wikipedia}
 */
export function trieCreate<T>(): Trie<T> {
  return {
    left: null,
    charCode: -1,
    hasContinuation: false,
    prev: null,
    next: null,
    last: null,
    key: null,
    value: undefined,
    isLeaf: false,
    leafCharCodes: null,
    // length: 0,
  };
}
