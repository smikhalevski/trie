import { ArrayTrie, Trie } from './trie-types';

/**
 * Encodes a {@linkcode Trie} instance as an {@linkcode ArrayTrie}.
 *
 * @param trie The trie to encode.
 * @returns The array trie that contains all nodes from the `trie`.
 * @template T The value stored in a trie.
 */
export function arrayTrieEncode<T>(trie: Trie<T>): ArrayTrie<T> {
  const nodes: number[] = [];
  const values: T[] = [];

  appendNode(trie, nodes, values);

  return { nodes, values };
}

/**
 * {@linkcode ArrayTrie.nodes} contain encoded trie nodes. Each node has a type and additional data. Each node
 * constrains the consequent array elements as described in the snippet below. Square brackets denote a single array
 * element.
 *
 * ```
 * Node                                    Consequent array elements
 *
 * [leafCharCodesLength,  LEAF          ], [valueIndex], [charCode] * leafCharCodesLength
 * [charCode,             BRANCH_1      ], [nextNode]
 * [charCode,             BRANCH_1_LEAF ], [valueIndex], [nextNode]
 * [childCharCodesLength, BRANCH_N      ], ([charCode], [offset]) * childCharCodesLength
 * [childCharCodesLength, BRANCH_N_LEAF ], [valueIndex], ([charCode], [offset]) * childCharCodesLength
 * ```
 *
 * - `leafCharCodesLength` is the length of {@linkcode Trie.leafCharCodes}.
 * - `childCharCodesLength` is the number of sub-tries in a trie.
 * - `valueIndex` is an index in {@linkcode ArrayTrie.values} that corresponds to a leaf node.
 * - `nextNode` is the next node that the search algorithm must process.
 * - `offset` is a relative index in {@linkcode ArrayTrie.nodes} at which the next node of the trie is stored.
 * It is relative to the index at which it is written.
 */
export const enum NodeType {
  LEAF = 0b001,
  BRANCH_1 = 0b010,
  BRANCH_N = 0b100,
  BRANCH_1_LEAF = BRANCH_1 | LEAF,
  BRANCH_N_LEAF = BRANCH_N | LEAF,
  BRANCH = BRANCH_1 | BRANCH_N,
}

function appendNode(trie: Trie<unknown>, nodes: number[], values: unknown[]): void {
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
      nodes.push(createNode(NodeType.BRANCH_1_LEAF, charCode), addValue(values, value));
    } else {
      nodes.push(createNode(NodeType.BRANCH_1, charCode));
    }
    appendNode(trie[charCode]!, nodes, values);
    return;
  }

  if (trie.isLeaf) {
    nodes.push(createNode(NodeType.BRANCH_N_LEAF, charCodesLength), addValue(values, value));
  } else {
    nodes.push(createNode(NodeType.BRANCH_N, charCodesLength));
  }

  let offset = nodes.length;

  for (let i = 0; i < charCodesLength; ++i) {
    nodes.push(0, 0);
  }
  for (let i = 0; i < charCodesLength; ++i) {
    const charCode = charCodes[i];

    nodes[offset++] = charCode;
    nodes[offset++] = nodes.length - offset;

    appendNode(trie[charCode]!, nodes, values);
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
  return charCodes.sort(sortAsc);
}

function sortAsc(a: number, b: number): number {
  return a - b;
}
