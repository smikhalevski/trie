import {Trie} from './trie-types';

export function collectTrieLeafs<T>(trie: Trie<T>, leafs: Trie<T>[] = []): Trie<T>[] {
  if (trie.isLeaf) {
    leafs.push(trie);
  }
  if (trie.next !== null) {
    for (const nextTrie of trie.next) {
      collectTrieLeafs(nextTrie, leafs);
    }
  }
  return leafs;
}
