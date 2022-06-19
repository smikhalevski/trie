import {Trie} from './trie-types';
import {trieSearch} from './trieSearch';

export function trieGet<T>(trie: Trie<T>, key: string): Trie<T> | null {
  const leaf = trieSearch(trie, key);

  return leaf !== null && leaf.length === key.length ? leaf : null;
}
