import { EncodedTrie, NodeType } from './trie-types';

export function trieSearchEncoded<T>(
  encodedTrie: EncodedTrie<T>,
  input: string,
  startIndex = 0,
  endIndex = input.length,
  exact = false
): T | null {
  const { arr, values } = encodedTrie;

  let valueIndex = -1;
  let cursor = 0;
  let i = startIndex;

  search: while (i < endIndex) {
    const node = arr[cursor];
    const nodeType = node & 0b111;
    const data = node >> 3;

    if (nodeType === NodeType.LEAF) {
      // data = leafCharCodesLength
      if (i + data > endIndex) {
        break;
      }
      ++cursor;

      if (data === 0) {
        valueIndex = arr[cursor];
        break;
      }
      let j = 0;
      while (j < data && input.charCodeAt(i) === arr[cursor + j + 1]) {
        ++j;
        ++i;
      }
      if (j === data) {
        valueIndex = arr[cursor];
      }
      break;
    }

    if (nodeType === NodeType.SINGLE_BRANCH) {
      // data = charCode
      if (input.charCodeAt(i) !== data) {
        break;
      }
      ++cursor;
      ++i;
      continue;
    }

    if (nodeType === NodeType.SINGLE_BRANCH_LEAF) {
      // data = charCode
      ++cursor;

      valueIndex = arr[cursor];

      if (input.charCodeAt(i) !== data) {
        break;
      }
      ++cursor;
      ++i;
      continue;
    }

    if (nodeType === NodeType.MULTI_BRANCH) {
      // data = childCharCodesLength
      ++cursor;
      const charCode = input.charCodeAt(i);
      ++i;

      for (let k = 0; k < data; ++k) {
        if (charCode === arr[cursor + k * 2]) {
          valueIndex = arr[cursor + k * 2 + 1];
          continue search;
        }
      }
      break;
    }

    if (nodeType === NodeType.MULTI_BRANCH_LEAF) {
      // data = childCharCodesLength
      ++cursor;
      valueIndex = arr[cursor];

      ++cursor;
      const charCode = input.charCodeAt(i);
      ++i;

      for (let k = 0; k < data; ++k) {
        if (charCode === arr[cursor + k * 2]) {
          valueIndex = arr[cursor + k * 2 + 1];
          continue search;
        }
      }
      break;
    }
  }

  if (valueIndex === -1 || (exact && i !== endIndex)) {
    return null;
  }
  return values[valueIndex];

  // if (startIndex === endIndex && cursor < arr.length) {
  //   const node = arr[cursor];
  //   const nodeType = node & 0b111;
  //
  //   if (
  //     nodeType === NodeType.MULTI_BRANCH_LEAF ||
  //     nodeType === NodeType.SINGLE_BRANCH_LEAF ||
  //     (nodeType === NodeType.LEAF && node >> 3 === 0)
  //   ) {
  //     value = decodeValue(arr[cursor + 1]);
  //   }
  // }
}
