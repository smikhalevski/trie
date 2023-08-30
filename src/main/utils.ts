/**
 * {@link ArrayTrie.nodes} contain encoded trie nodes. Each node has a type and additional data. Each node constrains
 * the consequent array elements as described in the snippet below. Square brackets denote a single array element.
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
 * - `leafCharCodesLength` is the length of {@link Trie.leafCharCodes}.
 * - `childCharCodesLength` is the number of sub-tries in a trie.
 * - `valueIndex` is an index in {@link ArrayTrie.values} that corresponds to a leaf node.
 * - `nextNode` is the next node that the search algorithm must process.
 * - `offset` is a relative index in {@link ArrayTrie.nodes} at which the next node of the trie is stored. It is
 * relative to the index at which it is written.
 */
export const LEAF = 0b001;
export const BRANCH_1 = 0b010;
export const BRANCH_N = 0b100;
export const BRANCH_1_LEAF = BRANCH_1 | LEAF;
export const BRANCH_N_LEAF = BRANCH_N | LEAF;
export const BRANCH = BRANCH_1 | BRANCH_N;

/**
 * Provide this function is you want to alter the chars that are read from the string on the fly. For example, you can
 * change case or replace chars.
 *
 * @param str The string to read the char from
 * @param index The inder of the char.
 */
export function getCharCodeAt(str: string, index: number): number {
  return str.charCodeAt(index);
}

export const isNaN = Number.isNaN || (value => value !== value);
