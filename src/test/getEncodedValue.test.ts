import { createTrie, encodeTrie, getEncodedValue, setValue, Trie } from '../main';

describe('getEncodedValue', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = createTrie();
  });

  test('finds a key for a root leaf', () => {
    setValue(trie, '', 111);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, '')).toBe(111);
  });

  test('finds a key for a single leaf', () => {
    setValue(trie, 'a', 111);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'a')).toBe(111);
  });

  test('finds a key for multiple values', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'b', 222);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'a')).toBe(111);
    expect(getEncodedValue(encodedTrie, 'b')).toBe(222);
  });

  test('finds keys with common prefix', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'ab', 222);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'aa')).toBe(111);
    expect(getEncodedValue(encodedTrie, 'ab')).toBe(222);
  });

  test('finds a key with leaf chars', () => {
    setValue(trie, 'aab', 111);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'aab')).toBe(111);
  });

  test('finds keys that fully intersect', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'aa')).toBe(111);
    expect(getEncodedValue(encodedTrie, 'aac')).toBe(undefined);
    expect(getEncodedValue(encodedTrie, 'aab')).toBe(222);
    expect(getEncodedValue(encodedTrie, 'aabd')).toBe(undefined);
  });

  test('finds keys with common prefix and siblings', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'ab', 222);
    setValue(trie, 'ac', 333);

    const encodedTrie = encodeTrie(trie);

    expect(getEncodedValue(encodedTrie, 'a')).toBe(111);
    expect(getEncodedValue(encodedTrie, 'ab')).toBe(222);
    expect(getEncodedValue(encodedTrie, 'ac')).toBe(333);
  });
});
