import { Trie } from './types';

/**
 * Creates a compressed trie data structure.
 *
 * @template Value The value stored in a trie.
 */
export function trieCreate<Value>(): Trie<Value> {
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
