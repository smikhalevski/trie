import { createTrie, encodeTrie, setValue, Trie } from '../../main';

describe('encodeTrie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('encodes a trie with no values', () => {
    expect(encodeTrie(trie)).toEqual({
      nodes: [],
      values: [],
    });
  });

  test('encodes a trie with a 1 value of 0 chars', () => {
    setValue(trie, '', 111);

    expect(encodeTrie(trie)).toEqual({
      nodes: [1, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 1 char', () => {
    setValue(trie, 'a', 111);

    expect(encodeTrie(trie)).toEqual({
      nodes: [778, 1, 0],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 2 chars', () => {
    setValue(trie, 'aa', 111);

    expect(encodeTrie(trie)).toEqual({
      nodes: [778, 9, 0, 97],
      values: [111],
    });
  });

  test('encodes a trie with a 1 value of 3 chars', () => {
    setValue(trie, 'abc', 111);

    expect(encodeTrie(trie)).toEqual({
      nodes: [778, 17, 0, 98, 99],
      values: [111],
    });
  });

  test('encodes a trie with a 2 values of 1 char', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'b', 222);

    expect(encodeTrie(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 1],
      values: [111, 222],
    });
  });

  test('stores unique values', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'b', 111);

    expect(encodeTrie(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 0],
      values: [111],
    });
  });

  test('stores unique NaN values', () => {
    setValue(trie, 'a', NaN);
    setValue(trie, 'b', NaN);

    expect(encodeTrie(trie)).toEqual({
      nodes: [20, 97, 2, 98, 2, 1, 0, 1, 0],
      values: [NaN],
    });
  });

  test('encodes a trie with a 2 values of 2 char with a common prefix', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'ab', 222);

    expect(encodeTrie(trie)).toEqual({
      nodes: [778, 20, 97, 2, 98, 2, 1, 0, 1, 1],
      values: [111, 222],
    });
  });

  test('encodes a trie with a 2 values that fully intersect', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);

    expect(encodeTrie(trie)).toEqual({
      nodes: [778, 778, 787, 0, 1, 1],
      values: [111, 222],
    });
  });
});
