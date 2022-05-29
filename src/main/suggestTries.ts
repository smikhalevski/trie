import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';
import {collectTrieLeafs} from './collectTrieLeafs';

export function suggestTries<T>(trie: Trie<T>, input: string, startIndex: number, endIndex = input.length, suggestions: Trie<T>[] = []): Trie<T>[] {
  const lastTrie = searchTrie(trie, input, startIndex, endIndex, true);

  if (lastTrie !== null && lastTrie.length === endIndex - startIndex) {
    return collectTrieLeafs(lastTrie, suggestions);
  }
  return suggestions;
}
