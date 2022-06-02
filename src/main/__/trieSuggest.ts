import {Trie} from '../trie-types';
import {trieCollect} from './trieCollect';

/**
 * Returns the list of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.
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
export function trieSuggest<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length, leafs: Trie<T>[] = []): Trie<T>[] {

  // for (let i = startIndex; i < endIndex; ++i) {
  //
  //   if (trie.nextCharCodes === null) {
  //     break;
  //   }
  //
  //   const next = trie[input.charCodeAt(i)];
  //   if (next === undefined) {
  //     break;
  //   }
  //
  //   trie = next;
  // }

  return trieCollect(trie, leafs);
}
