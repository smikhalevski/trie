import {Trie} from './trie-types';
import {trieCollect} from './__/trieCollect';

/**
 * Returns the list of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The array of leafs.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSuggest<T>(trie: Trie<T>, input: string, startIndex = 0, endIndex = input.length): readonly Trie<T>[] {

  let suggestions: Trie<T>[] | null = null;

  for (let i = startIndex; i < endIndex; ++i) {

    if (trie.last === null) {
      break;
    }

    // If trie has only one child then we can reuse its suggestions
    suggestions = trie.last !== trie.next ? trie.suggestions : null;

    const child = trie[input.charCodeAt(i)];
    if (child === undefined) {
      break;
    }

    trie = child;
  }

  if (suggestions !== null) {
    return trie.suggestions = suggestions;
  }

  suggestions = [];

  if (trie.isLeaf) {
    suggestions.push(trie);
  }

  const trieParent = trie.parent;

  for (let next = trie.next; next !== null && next.parent !== trieParent; next = next.next) {
    if (next.isLeaf) {
      suggestions.push(next);
    }
  }

  // Populate ancestors that have only one child with computed suggestions
  for (let parent = trieParent; parent !== null && parent.next === parent.last; parent = parent.parent) {
    parent.suggestions = suggestions;
  }

  return trie.suggestions = suggestions;
}
