import { createTrie, convertTrie, setValue, Node } from '../../main';
import { getValue } from '../../main/array';

describe('getValue', () => {
  let trie: Node;

  beforeEach(() => {
    trie = createTrie();
  });

  test('finds a key for a root leaf', () => {
    setValue(trie, '', 111);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, '')).toBe(111);
  });

  test('finds a key for a single leaf', () => {
    setValue(trie, 'a', 111);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'a')).toBe(111);
  });

  test('finds a key for multiple values', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'b', 222);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'a')).toBe(111);
    expect(getValue(encodedTrie, 'b')).toBe(222);
  });

  test('finds keys with common prefix', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'ab', 222);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'aa')).toBe(111);
    expect(getValue(encodedTrie, 'ab')).toBe(222);
  });

  test('finds a key with leaf chars', () => {
    setValue(trie, 'aab', 111);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'aab')).toBe(111);
  });

  test('finds keys that fully intersect', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'aa')).toBe(111);
    expect(getValue(encodedTrie, 'aac')).toBe(undefined);
    expect(getValue(encodedTrie, 'aab')).toBe(222);
    expect(getValue(encodedTrie, 'aabd')).toBe(undefined);
  });

  test('finds keys with common prefix and siblings', () => {
    setValue(trie, 'a', 111);
    setValue(trie, 'ab', 222);
    setValue(trie, 'ac', 333);

    const encodedTrie = convertTrie(trie);

    expect(getValue(encodedTrie, 'a')).toBe(111);
    expect(getValue(encodedTrie, 'ab')).toBe(222);
    expect(getValue(encodedTrie, 'ac')).toBe(333);
  });
});
