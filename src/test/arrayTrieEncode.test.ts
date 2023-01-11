import { arrayTrieEncode, Trie, trieCreate, trieSet } from '../main';

describe('arrayTrieEncode', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('encodes a trie with no values', () => {
    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [],
      values: [],
    });
  });

  test('encodes a trie with a 1 value of 0 chars', () => {
    trieSet(trie, '', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [1, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 1 char', () => {
    trieSet(trie, 'a', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [778, 1, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 2 chars', () => {
    trieSet(trie, 'aa', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [778, 9, 0, 97],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 3 chars', () => {
    trieSet(trie, 'abc', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [778, 17, 0, 98, 99],
      values: [111],
    });
  });

  test('encodes a trie with a 2 values of 1 char', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 1],
      values: [111, 222],
    });
  });

  test('stores unique values', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 0],
      values: [111],
    });
  });

  test('stores unique NaN values', () => {
    trieSet(trie, 'a', NaN);
    trieSet(trie, 'b', NaN);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 0],
      values: [NaN],
    });
  });

  test('encodes a trie with a 2 values of 2 char with a common prefix', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'ab', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [778, 20, 97, 2, 98, 2, 1, 0, 1, 1],
      values: [111, 222],
    });
  });

  test('encodes a trie with a 2 values that fully intersect', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'aab', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [778, 778, 787, 0, 1, 1],
      values: [111, 222],
    });
  });
});
