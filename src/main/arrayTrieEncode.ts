import { ArrayTrie, NodeType, Trie } from './trie-types';

/**
 * Encodes a trie as an {@linkcode ArrayTrie}.
 *
 * @param trie The trie to encode.
 * @returns The array trie that contains all nodes from the `trie`.
 * @template T The value stored in a trie.
 */
export function arrayTrieEncode<T>(trie: Trie<T>): ArrayTrie<T> {
  const nodes: number[] = [];
  const values: T[] = [];

  addNode(trie, nodes, values);

  return { nodes, values };
}

function addNode(trie: Trie<unknown>, nodes: number[], values: unknown[]): void {
  const { value } = trie;

  if (trie.last === null) {
    const leafCharCodes = trie.leafCharCodes;

    if (!trie.isLeaf) {
      return;
    }
    if (leafCharCodes === null) {
      nodes.push(createNode(NodeType.LEAF, 0), addValue(values, value));
      return;
    }

    nodes.push(createNode(NodeType.LEAF, leafCharCodes.length), addValue(values, value));
    nodes.push(...leafCharCodes);
    return;
  }

  const charCodes = getCharCodes(trie);
  const charCodesLength = charCodes.length;

  if (charCodesLength === 1) {
    const charCode = charCodes[0];

    if (trie.isLeaf) {
      nodes.push(createNode(NodeType.SINGLE_BRANCH_LEAF, charCode), addValue(values, value));
    } else {
      nodes.push(createNode(NodeType.SINGLE_BRANCH, charCode));
    }
    addNode(trie[charCode]!, nodes, values);
    return;
  }

  if (trie.isLeaf) {
    nodes.push(createNode(NodeType.MULTI_BRANCH_LEAF, charCodesLength), addValue(values, value));
  } else {
    nodes.push(createNode(NodeType.MULTI_BRANCH, charCodesLength));
  }

  let offset = nodes.length;

  for (let i = 0; i < charCodesLength; ++i) {
    nodes.push(0, 0);
  }
  for (let i = 0; i < charCodesLength; ++i) {
    const charCode = charCodes[i];

    nodes[offset++] = charCode;
    nodes[offset++] = nodes.length;

    addNode(trie[charCode]!, nodes, values);
  }
}

function addValue(values: unknown[], value: unknown): number {
  const index = value === value ? values.indexOf(value) : values.findIndex(Number.isNaN);

  return index !== -1 ? index : values.push(value) - 1;
}

function createNode(type: NodeType, data: number): number {
  return type + (data << 3);
}

function getCharCodes(trie: Trie<unknown>): number[] {
  const charCodes = [];

  for (const key in trie) {
    const charCode = +key;

    if (charCode === charCode && trie[charCode] !== undefined) {
      charCodes.push(charCode);
    }
  }
  return charCodes;
}
