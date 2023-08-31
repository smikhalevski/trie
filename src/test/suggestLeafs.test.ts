import { createSuggestLeafs, createTrie, setValue, suggestLeafs, Trie } from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('suggestLeafs', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('suggests leaf tries', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggestLeafs(trie, 'abc', 0);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D]]);
  });

  test('suggests leaf tries using a char code getter', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);

    const suggestLeafs = createSuggestLeafs((str, index) => str.toLowerCase().charCodeAt(index));

    const suggestions = suggestLeafs(trie, 'ABC', 0, 3);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D]]);
  });

  test('suggests leaf tries for an empty key', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggestLeafs(trie, '', 0);

    expect(suggestions).toEqual([trie[A], trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('suggests leaf tries with endIndex', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggestLeafs(trie, 'abcd', 0, 2);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('does not suggest leafs that are too short', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggestLeafs(trie, 'abcd');

    expect(suggestions).toBe(null);
  });

  test('suggests a leaf that has exact length', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggestLeafs(trie, 'abc');

    expect(suggestions).toEqual([trie[A]]);
  });

  test('returns longer key for short input', () => {
    setValue(trie, 'abcd', 111);

    expect(suggestLeafs(trie, 'ab')).toEqual([trie[A]]);
  });

  test('returns the same array on each call', () => {
    setValue(trie, 'abc', 111);

    expect(suggestLeafs(trie, 'abc')).toBe(suggestLeafs(trie, 'abc'));
  });

  test('populates parent caches', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcd', 222);

    const suggestions = suggestLeafs(trie, 'abc');

    expect(suggestions).toBe(suggestLeafs(trie, 'ab'));
    expect(suggestions).toBe(suggestLeafs(trie, 'a'));
    expect(suggestions).toBe(suggestLeafs(trie, ''));
  });

  test('populates parent caches up to the closest fork', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcd', 222);
    setValue(trie, 'e', 222);

    const suggestions = suggestLeafs(trie, 'abc');

    expect(suggestions).toBe(suggestLeafs(trie, 'ab'));
    expect(suggestions).toBe(suggestLeafs(trie, 'a'));
    expect(suggestions).not.toBe(suggestLeafs(trie, ''));
  });

  test('cleans up cache during set', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggestLeafs(trie, 'abc');

    setValue(trie, 'abcd', 222);

    expect(suggestions).not.toBe(suggestLeafs(trie, 'abc'));
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      setValue(trie, key, key);
    });

    expect(suggestLeafs(trie, 'abalo')?.length).toBe(1);
    expect(suggestLeafs(trie, 'abbot')?.length).toBe(2);
    expect(suggestLeafs(trie, 'abb')?.length).toBe(12);
  });
});
