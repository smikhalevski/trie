import type * as Trie from '../types';

export type Node<Value> =
  | { [charCode: number]: Node<Value> }
  | [value: Value, node: { [charCode: number]: Node<Value> }] // Intermediate leaf node
  | [value: Value, leafChars: string] // Terminal leaf node
  | Value; // Non-object values are stored without a wrapping array

export function convertTrie<Value>(trie: Trie.Node<Value>): Node<Value> {
  let nodes: { [charCode: number]: Node<Value> } | null = null;

  const value = trie.value!;

  for (const key in trie) {
    const charCode = +key;

    if (charCode === charCode) {
      (nodes ||= {})[charCode] = convertTrie(trie[charCode]!);
    }
  }
  if (!trie.isLeaf) {
    return nodes || {};
  }
  if (nodes !== null) {
    return [value, nodes];
  }
  if (trie.leafCharCodes !== null) {
    return [value, String.fromCharCode(...trie.leafCharCodes)];
  }
  if (value !== null && typeof value === 'object') {
    return [value];
  }
  return value;
}
