import { Trie } from '../types';
import { BRANCH_1, BRANCH_1_LEAF, BRANCH_N, BRANCH_N_LEAF, isNaN, LEAF } from '../utils';
import { ArrayTrie } from './types';

/**
 * Encodes a {@link Trie} instance as an {@link ArrayTrie}.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 *
 * const encodedTrie = encodeTrie(trie);
 *
 * getValue(encodedTrie, 'foo');
 * // ⮕ 111
 * ```
 *
 * @param trie The trie to encode.
 * @returns The array trie that contains all nodes from the `trie`.
 * @template Value The value stored in a trie.
 */
export function encodeTrie<Value>(trie: Trie<Value>): ArrayTrie<Value> {
  const nodes: number[] = [];
  const values: Value[] = [];

  appendNode(trie, nodes, values);

  return { nodes, values };
}

function appendNode(trie: Trie<unknown>, nodes: number[], values: unknown[]): void {
  const { value } = trie;

  if (trie.last === null) {
    const leafCharCodes = trie.leafCharCodes;

    if (!trie.isLeaf) {
      return;
    }
    if (leafCharCodes === null) {
      nodes.push(createNode(LEAF, 0), addValue(values, value));
      return;
    }

    nodes.push(createNode(LEAF, leafCharCodes.length), addValue(values, value));
    nodes.push(...leafCharCodes);
    return;
  }

  const charCodes = getCharCodes(trie);
  const charCodesLength = charCodes.length;

  if (charCodesLength === 1) {
    const charCode = charCodes[0];

    if (trie.isLeaf) {
      nodes.push(createNode(BRANCH_1_LEAF, charCode), addValue(values, value));
    } else {
      nodes.push(createNode(BRANCH_1, charCode));
    }
    appendNode(trie[charCode]!, nodes, values);
    return;
  }

  if (trie.isLeaf) {
    nodes.push(createNode(BRANCH_N_LEAF, charCodesLength), addValue(values, value));
  } else {
    nodes.push(createNode(BRANCH_N, charCodesLength));
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
  const index = value === value ? values.indexOf(value) : values.findIndex(isNaN);

  return index !== -1 ? index : values.push(value) - 1;
}

function createNode(type: number, data: number): number {
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
