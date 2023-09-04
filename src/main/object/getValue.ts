import { Node } from './convertTrie';
import { getCharCodeAt } from '../utils';

/**
 * The search result returned from {@link search}.
 */
export interface Match<Value = any> {
  /**
   * The value that corresponds to the matched key.
   */
  value: Value;

  /**
   * The last index in the input at which the key was successfully matched.
   */
  lastIndex: number;
}

const isArray = Array.isArray;

const NO_VALUE = {} as any;

export function createSearch(charCodeAt: typeof getCharCodeAt) {
  return <Value>(
    trie: Node<Value>,
    input: string,
    startIndex = 0,
    endIndex = input.length,
    match?: Match<Value>
  ): Match<Value> | null => {
    let i = startIndex;
    let value = NO_VALUE;
    let leafChars, leafCharsLength;

    inputChars: while (i < endIndex) {
      if (trie === null || typeof trie !== 'object') {
        break;
      }
      if (!isArray(trie)) {
        trie = (trie as any)[charCodeAt(input, i)];
        continue;
      }
      if (typeof (leafChars = trie[1]) !== 'string' || i + (leafCharsLength = leafChars.length) > endIndex) {
        break;
      }
      for (let j = 0; j < leafCharsLength; ++j) {
        if (charCodeAt(leafChars, j) !== charCodeAt(input, i + j)) {
          break inputChars;
        }
      }
      value = trie[0];
      i += leafCharsLength;
    }

    if (trie === null || typeof trie !== 'object') {
      value = trie;
    } else if (isArray(trie) && typeof trie[1] === 'object') {
      value = trie[0];
    }
    if (value === NO_VALUE) {
      return null;
    }
    if (match !== undefined) {
      match.value = value;
      match.lastIndex = i;
      return match;
    }
    return { value, lastIndex: i };
  };
}
