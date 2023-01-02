import { EncodedTrie, NodeType, Trie } from './trie-types';

/**
 * Encodes a trie into an array of offsets.
 *
 * @param trie The trie to encode.
 * @returns The encoded trie.
 */
export function trieEncode<T>(trie: Trie<T>): EncodedTrie<T> {
  const arr: number[] = [];
  const values: T[] = [];

  addTrie(trie, 0, arr, values);

  return { arr, values };
}

function addTrie(trie: Trie<unknown>, offset: number, arr: number[], values: unknown[]): number {
  const childCharCodes = getCharCodes(trie);
  const childCharCodesLength = childCharCodes.length;

  if (childCharCodesLength === 0) {
    const leafCharCodes = trie.leafCharCodes;

    if (leafCharCodes === null) {
      arr[offset++] = createNode(NodeType.LEAF, 0);
      return offset;
    }

    arr[offset++] = createNode(NodeType.LEAF, leafCharCodes.length);
    arr[offset++] = addValue(values, trie.value);

    for (const charCode of leafCharCodes) {
      arr[offset++] = charCode;
    }

    return offset;
  }

  if (childCharCodesLength === 1) {
    const charCode = childCharCodes[0];
    const child = trie[charCode]!;

    if (trie.isLeaf) {
      arr[offset++] = createNode(NodeType.SINGLE_BRANCH_LEAF, charCode);
      arr[offset++] = addValue(values, trie.value);
    } else {
      arr[offset++] = createNode(NodeType.SINGLE_BRANCH, charCode);
    }
    return addTrie(child, offset, arr, values);
  }

  if (trie.isLeaf) {
    arr[offset++] = createNode(NodeType.MULTI_BRANCH_LEAF, childCharCodesLength);
    arr[offset++] = addValue(values, trie.value);
  } else {
    arr[offset++] = createNode(NodeType.MULTI_BRANCH, childCharCodesLength);
  }

  let childOffset = offset + childCharCodesLength * 2;

  for (const charCode of childCharCodes) {
    arr.push(0, 0);
  }
  for (const charCode of childCharCodes) {
    childOffset = addTrie(trie[charCode]!, childOffset, arr, values);

    arr[offset++] = charCode;
    arr[offset++] = childOffset;
  }
  return childOffset;
}

function addValue(values: unknown[], value: unknown): number {
  const index = values.indexOf(value);

  return index !== -1 ? index : values.push(value) - 1;
}

function createNode(nodeType: NodeType, data: number): number {
  return (data << 3) + nodeType;
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
