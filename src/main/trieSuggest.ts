import {Trie} from './trie-types';

/**
 * Returns the list of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The readonly array of leafs or `null` if there's no matching key.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSuggest<T>(trie: Trie<T>, input: string, startIndex = 0, endIndex = input.length): readonly Trie<T>[] | null {

  let i = startIndex;

  while (i < endIndex) {

    if (trie.last === null) {
      break;
    }

    const child = trie[input.charCodeAt(i)];
    if (child === undefined) {
      break;
    }

    trie = child;
    ++i;
  }

  // Check that there's a sufficient number of characters to satisfy the requested prefix
  if (i !== endIndex) {

    const trieLeafCharCodes = trie.leafCharCodes;
    if (trieLeafCharCodes === null) {
      return null;
    }

    const trieLeafCharCodesLength = trieLeafCharCodes.length;
    if (i + trieLeafCharCodesLength < endIndex) {
      return null;
    }

    let j = 0;
    while (j < trieLeafCharCodesLength && input.charCodeAt(i) === trieLeafCharCodes[j]) {
      ++j;
      ++i;
    }
    if (j < trieLeafCharCodesLength) {
      return null;
    }
  }

  const trieSuggestions = trie.suggestions;
  if (trieSuggestions !== null) {
    return trieSuggestions;
  }

  const suggestions: Trie<T>[] = [];

  if (trie.isLeaf) {
    suggestions.push(trie);
  }

  // Collect leafs
  for (let next = trie.next, last = trie.last; next !== null && last !== null; next = next.next) {
    if (next.isLeaf) {
      suggestions.push(next);
    }
    if (next === last) {
      last = next.last;
    }
  }

  // Populate leafs for ancestors that have only one child
  for (let parent = trie.parent; parent !== null && parent.next === parent.last; parent = parent.parent) {
    parent.suggestions = suggestions;
  }

  return trie.suggestions = suggestions;
}
