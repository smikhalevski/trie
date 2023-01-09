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
      nodes: [0, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 1 char', () => {
    trieSet(trie, 'a', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [777, 0, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 2 chars', () => {
    trieSet(trie, 'aa', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [777, 8, 0, 97],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 3 chars', () => {
    trieSet(trie, 'abc', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [777, 16, 0, 98, 99],
      values: [111],
    });
  });

  test('encodes a trie with a 2 values of 1 char', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [19, 97, 5, 98, 7, 0, 0, 0, 1],
      values: [111, 222],
    });
  });

  test('stores unique values', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 111);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [19, 97, 5, 98, 7, 0, 0, 0, 0],
      values: [111],
    });
  });

  test('stores unique NaN values', () => {
    trieSet(trie, 'a', NaN);
    trieSet(trie, 'b', NaN);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [19, 97, 5, 98, 7, 0, 0, 0, 0],
      values: [NaN],
    });
  });

  test('encodes a trie with a 2 values of 2 char with a common prefix', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'ab', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [777, 19, 97, 6, 98, 8, 0, 0, 0, 1],
      values: [111, 222],
    });
  });

  test('encodes a trie with a 2 values that fully intersect', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'aab', 222);

    expect(arrayTrieEncode(trie)).toEqual({
      nodes: [777, 777, 786, 0, 0, 1],
      values: [111, 222],
    });
  });
});
