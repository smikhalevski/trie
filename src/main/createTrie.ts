import {Trie} from './trie-types';

/**
 * Creates a trie node.
 *
 * @see {@link https://en.wikipedia.org/wiki/Trie Trie on Wikipedia}
 */
export function createTrie<T>(): Trie<T> {
  return {
    prev: null,
    children: null,
    childrenCharCodes: null,
    word: null,
    value: undefined,
    length: 0,
    isLeaf: false,
    leafCharCodes: null,
  };
}
