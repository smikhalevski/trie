import { Trie, trieCreate, trieSet, trieSuggest } from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('trieSuggest', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('suggests leaf tries', () => {
    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const suggestions = trieSuggest(trie, 'abc', 0);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D]]);
  });

  test('suggests leaf tries for an empty key', () => {
    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const suggestions = trieSuggest(trie, '', 0);

    expect(suggestions).toEqual([trie[A], trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('suggests leaf tries with endIndex', () => {
    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const suggestions = trieSuggest(trie, 'abcd', 0, 2);

    expect(suggestions).toEqual([trie[A]![B]![C], trie[A]![B]![C]![D], trie[A]![B]![E]]);
  });

  test('does not suggest leafs that are too short', () => {
    trieSet(trie, 'abc', 111);

    const suggestions = trieSuggest(trie, 'abcd');

    expect(suggestions).toBe(null);
  });

  test('suggests a leaf that has exact length', () => {
    trieSet(trie, 'abc', 111);

    const suggestions = trieSuggest(trie, 'abc');

    expect(suggestions).toEqual([trie[A]]);
  });

  test('returns longer key for short input', () => {
    trieSet(trie, 'abcd', 111);

    expect(trieSuggest(trie, 'ab')).toEqual([trie[A]]);
  });

  test('returns the same array on each call', () => {
    trieSet(trie, 'abc', 111);

    expect(trieSuggest(trie, 'abc')).toBe(trieSuggest(trie, 'abc'));
  });

  test('populates parent caches', () => {
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcd', 222);

    const suggestions = trieSuggest(trie, 'abc');

    expect(suggestions).toBe(trieSuggest(trie, 'ab'));
    expect(suggestions).toBe(trieSuggest(trie, 'a'));
    expect(suggestions).toBe(trieSuggest(trie, ''));
  });

  test('populates parent caches up to the closest fork', () => {
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcd', 222);
    trieSet(trie, 'e', 222);

    const suggestions = trieSuggest(trie, 'abc');

    expect(suggestions).toBe(trieSuggest(trie, 'ab'));
    expect(suggestions).toBe(trieSuggest(trie, 'a'));
    expect(suggestions).not.toBe(trieSuggest(trie, ''));
  });

  test('cleans up cache during set', () => {
    trieSet(trie, 'abc', 111);

    const suggestions = trieSuggest(trie, 'abc');

    trieSet(trie, 'abcd', 222);

    expect(suggestions).not.toBe(trieSuggest(trie, 'abc'));
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(word => {
      trieSet(trie, word, word);
    });

    expect(trieSuggest(trie, 'abalo')?.length).toBe(1);
    expect(trieSuggest(trie, 'abbot')?.length).toBe(2);
    expect(trieSuggest(trie, 'abb')?.length).toBe(12);
  });
});
