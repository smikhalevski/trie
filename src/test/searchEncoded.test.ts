import { createSearchEncoded, createTrie, encodeTrie, searchEncoded, setValue, Trie } from '../main';
import dictionary from './dictionary.json';

describe('searchEncoded', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('finds a key for a root leaf', () => {
    setValue(trie, '', 111);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, '')).toEqual({ value: 111, lastIndex: 0 });
  });

  test('finds a key for a single leaf', () => {
    setValue(trie, 'a', 111);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
  });

  test('finds a key using a char code getter', () => {
    setValue(trie, 'aaa', 111);

    const encodedTrie = encodeTrie(trie);

    const searchEncoded = createSearchEncoded((str, index) => str.toLowerCase().charCodeAt(index));

    expect(searchEncoded(encodedTrie, 'AAA', 0, 3, undefined)).toEqual({ value: 111, lastIndex: 3 });
  });

  test('finds a key for multiple values', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'b', 222);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
    expect(searchEncoded(encodedTrie, 'b')).toEqual({ value: 222, lastIndex: 1 });
  });

  test('finds keys with common prefix', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'ab', 222);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'aa')).toEqual({ value: 111, lastIndex: 2 });
    expect(searchEncoded(encodedTrie, 'ab')).toEqual({ value: 222, lastIndex: 2 });
  });

  test('finds a key with leaf chars', () => {
    setValue(trie, 'aab', 111);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'aab')).toEqual({ value: 111, lastIndex: 3 });
  });

  test('finds keys that fully intersect', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'aa')).toEqual({ value: 111, lastIndex: 2 });
    expect(searchEncoded(encodedTrie, 'aac')).toEqual({ value: 111, lastIndex: 2 });
    expect(searchEncoded(encodedTrie, 'aab')).toEqual({ value: 222, lastIndex: 3 });
    expect(searchEncoded(encodedTrie, 'aabd')).toEqual({ value: 222, lastIndex: 3 });
  });

  test('finds keys with common prefix and siblings', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'ab', 222);
    setValue(trie, 'ac', 333);

    const encodedTrie = encodeTrie(trie);

    expect(searchEncoded(encodedTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
    expect(searchEncoded(encodedTrie, 'ab')).toEqual({ value: 222, lastIndex: 2 });
    expect(searchEncoded(encodedTrie, 'ac')).toEqual({ value: 333, lastIndex: 2 });
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      setValue(trie, key, key);
    });

    const encodedTrie = encodeTrie(trie);

    dictionary.forEach(key => {
      expect(searchEncoded(encodedTrie, key)).toEqual({ value: key, lastIndex: key.length });
    });
  });
});
