import { Trie, trieCreate, trieEncode, trieSearchEncoded, trieSet } from '../main';

const A = 'A'.charCodeAt(0);
const B = 'B'.charCodeAt(0);

describe('trieSearchEncoded', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('adds value to an array', () => {
    trieSet(trie, 'abc', 111);

    const encodedTrie = trieEncode(trie);

    expect(trieSearchEncoded(encodedTrie, 'abc')).toBe(111);
  });

  // test('adds two values to an array', () => {
  //   const trie = trieCreate<number[]>();
  //
  //   trieSet(trie, 'a', [A]);
  //   trieSet(trie, 'b', [B]);
  //
  //   const arr: number[] = [];
  //
  //   trieSearchEncoded(trie, 0, arr);
  //
  //   expect(getValueFromTrie(arr, 'a', 0)).toEqual('A');
  //   expect(getValueFromTrie(arr, 'b', 0)).toEqual('B');
  // });
  //
  // test('adds values with common prefix to an array', () => {
  //   const trie = trieCreate<number[]>();
  //
  //   trieSet(trie, 'aa', [A]);
  //   trieSet(trie, 'ab', [B]);
  //
  //   const arr: number[] = [];
  //
  //   trieSearchEncoded(trie, 0, arr);
  //
  //   expect(getValueFromTrie(arr, 'aa', 0)).toEqual('A');
  //   expect(getValueFromTrie(arr, 'ab', 0)).toEqual('B');
  // });
  //
  // test('adds short and long values', () => {
  //   const trie = trieCreate<number[]>();
  //
  //   trieSet(trie, 'aa', [A]);
  //   trieSet(trie, 'aab', [B]);
  //
  //   const arr: number[] = [];
  //
  //   trieSearchEncoded(trie, 0, arr);
  //
  //   expect(getValueFromTrie(arr, 'aa', 0)).toEqual('A');
  //   expect(getValueFromTrie(arr, 'aac', 0)).toEqual('A');
  //   expect(getValueFromTrie(arr, 'aab', 0)).toEqual('B');
  //   expect(getValueFromTrie(arr, 'aabd', 0)).toEqual('B');
  // });
});
