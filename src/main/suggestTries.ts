import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';
import {collectTries} from './collectTries';

/**
 * Returns the list of trie leafs that have keys that start with `input.substring(startIndex, endIndex)`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @param leafs The mutable in-out array of leafs that is populated during `trie` traversal.
 * @returns The array of leafs.
 *
 * @template T The type of values stored in a trie.
 */
export function suggestTries<T>(trie: Trie<T>, input: string, startIndex = 0, endIndex = input.length, leafs: Trie<T>[] = []): Trie<T>[] {
  const root = searchTrie(trie, input, startIndex, endIndex, true);

  return root === null || root.length !== endIndex - startIndex ? leafs : collectTries(root, leafs);
}
