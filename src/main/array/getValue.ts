import { search } from './search';
import { ArrayTrie, Match } from './types';

const match: Match = { value: null, lastIndex: -1 };

/**
 * Returns a value associated with the key, or `undefined` if there's no such key.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 * setValue(trie, 'bar', 222);
 *
 * const encodedTrie = encodeTrie(trie);
 *
 * getValue(encodedTrie, 'bar');
 * // ⮕ 222
 *
 * getValue(encodedTrie, 'qux');
 * // ⮕ undefined
 * ```
 *
 * @param trie The trie to search in.
 * @param key The key to retrieve.
 * @returns The value associated with the key, or `undefined` if there's no such key.
 * @template Value The value stored in a trie.
 */
export function getValue<Value>(trie: ArrayTrie<Value>, key: string): Value | undefined {
  if (search(trie, key, 0, key.length, match) !== null && match.lastIndex === key.length) {
    const { value } = match;
    match.value = null;
    return value;
  }
}
