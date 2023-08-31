import { createSuggest, createTrie, setValue, suggest, Trie } from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('suggest', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = createTrie();
  });

  test('suggests leaf tries', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggest(trie, 'abc', 0);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D]]);
  });

  test('suggests leaf tries using a char code getter', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);

    const suggest = createSuggest((str, index) => str.toLowerCase().charCodeAt(index));

    const suggestions = suggest(trie, 'ABC', 0, 3);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D]]);
  });

  test('suggests leaf tries for an empty key', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggest(trie, '', 0);

    expect(suggestions).toEqual([trie[A], trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('suggests leaf tries with endIndex', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const suggestions = suggest(trie, 'abcd', 0, 2);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('does not suggest leafs that are too short', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggest(trie, 'abcd');

    expect(suggestions).toBe(null);
  });

  test('suggests a leaf that has exact length', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggest(trie, 'abc');

    expect(suggestions).toEqual([trie[A]]);
  });

  test('returns longer key for short input', () => {
    setValue(trie, 'abcd', 111);

    expect(suggest(trie, 'ab')).toEqual([trie[A]]);
  });

  test('returns the same array on each call', () => {
    setValue(trie, 'abc', 111);

    expect(suggest(trie, 'abc')).toBe(suggest(trie, 'abc'));
  });

  test('populates parent caches', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcd', 222);

    const suggestions = suggest(trie, 'abc');

    expect(suggestions).toBe(suggest(trie, 'ab'));
    expect(suggestions).toBe(suggest(trie, 'a'));
    expect(suggestions).toBe(suggest(trie, ''));
  });

  test('populates parent caches up to the closest fork', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcd', 222);
    setValue(trie, 'e', 222);

    const suggestions = suggest(trie, 'abc');

    expect(suggestions).toBe(suggest(trie, 'ab'));
    expect(suggestions).toBe(suggest(trie, 'a'));
    expect(suggestions).not.toBe(suggest(trie, ''));
  });

  test('cleans up cache during set', () => {
    setValue(trie, 'abc', 111);

    const suggestions = suggest(trie, 'abc');

    setValue(trie, 'abcd', 222);

    expect(suggestions).not.toBe(suggest(trie, 'abc'));
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      setValue(trie, key, key);
    });

    expect(suggest(trie, 'abalo')?.length).toBe(1);
    expect(suggest(trie, 'abbot')?.length).toBe(2);
    expect(suggest(trie, 'abb')?.length).toBe(12);
  });
});
