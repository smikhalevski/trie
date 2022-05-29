import {Trie} from './trie-types';
import {searchTrie} from './searchTrie';

export function deleteTrie(trie: Trie<any>, word: string): boolean {
  let leaf = searchTrie(trie, word, 0)!;

  if (leaf === null) {
    return false;
  }

  leaf.word = null;
  leaf.value = undefined;
  leaf.isLeaf = false;
  leaf.leafCharCodes = null;

  if (leaf.next !== null && leaf.next.length === 1) {
    leaf = leaf.next[0];
  }

  while (leaf.prev !== null) {
    const trie = leaf.prev;
    const next = trie.next!;
    const word = leaf.word!;

    if (trie.isLeaf && next.length > 1 || next.length > 2) {
      const j = next.indexOf(leaf);
      next.splice(j, 1);
      trie.nextCharCodes!.splice(j, 1);
      break;
    }

    trie.isLeaf = true;

    const leafCharCodes = leaf.leafCharCodes;
    const trieCharCodes = trie.leafCharCodes ||= [];

    trieCharCodes.push(word.charCodeAt(trie.length));

    if (leafCharCodes) {
      trieCharCodes.push(...leafCharCodes);
    }

    trie.word = word;
    trie.value = leaf.value;
    trie.length = leaf.length;
    trie.next = null;
    trie.nextCharCodes = null;

    leaf = trie;
  }

  return true;
}
