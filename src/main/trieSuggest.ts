import {Trie} from './trie-types';

/**
 * Returns the list of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.
 *
 * @param trie The trie to search in.
 * @param input The string to search for the key from the `trie`.
 * @param startIndex The index in `input` to start reading substring from.
 * @param endIndex The index in `input` to stop reading.
 * @returns The readonly array of leafs. Don't mutate this array since it is cached in {@link Trie.leafs}.
 *
 * @template T The type of values stored in a trie.
 */
export function trieSuggest<T>(trie: Trie<T>, input: string, startIndex = 0, endIndex = input.length): readonly Trie<T>[] {

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
      return [];
    }

    const trieLeafCharCodesLength = trieLeafCharCodes.length;
    if (i + trieLeafCharCodesLength < endIndex) {
      return [];
    }

    let j = 0;
    while (j < trieLeafCharCodesLength && input.charCodeAt(i) === trieLeafCharCodes[j]) {
      ++j;
      ++i;
    }
    if (j < trieLeafCharCodesLength) {
      return [];
    }
  }

  const trieLeafs = trie.leafs;
  if (trieLeafs !== null) {
    return trieLeafs;
  }

  const leafs: Trie<T>[] = [];

  if (trie.isLeaf) {
    leafs.push(trie);
  }

  // Collect leafs
  for (let next = trie.next, last = trie.last; next !== null && last !== null; next = next.next) {
    if (next.isLeaf) {
      leafs.push(next);
    }
    if (next === last) {
      last = next.last;
    }
  }

  // Populate ancestors that have only one child with computed leafs
  for (let parent = trie.parent; parent !== null && parent.next === parent.last; parent = parent.parent) {
    parent.leafs = leafs;
  }

  return trie.leafs = leafs;
}
