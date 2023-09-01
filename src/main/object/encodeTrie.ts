import { Trie } from '../types';

export interface ObjectTrie<Value> {
  [char: string]:
    | ObjectTrie<Value>
    | [value: Value, trie: ObjectTrie<Value>]
    | [value: Value, remainder: string]
    | Value;
}

export function encodeTrie<Value>(trie: Trie<Value>): ObjectTrie<Value> {
  let obj: ObjectTrie<Value> | null = null;

  for (let key in trie) {
    const charCode = +key;

    if (charCode === charCode) {
      (obj ||= {})[String.fromCharCode(charCode)] = encodeTrie(trie[charCode]!);
    }
  }

  if (trie.isLeaf) {
    if (obj !== null) {
      return [trie.value!, obj] as any;
    }
    if (trie.leafCharCodes !== null) {
      return [trie.value, String.fromCharCode(...trie.leafCharCodes)] as any;
    }
    if (trie.value === null || typeof trie.value !== 'object') {
      return trie.value!;
    }
    return [trie.value] as any;
  }

  return obj!;
}
