import { Trie } from './trie-types';

/**
 * Creates a compressed trie data structure.
 *
 * @template T The value stored in a trie.
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
