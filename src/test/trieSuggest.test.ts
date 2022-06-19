import {trieCreate, trieSet, trieSuggest} from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('trieSuggest', () => {

  test('suggests leaf tries', () => {
    const trie = trieCreate();

    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const leafs = trieSuggest(trie, 'abc', 0);

    expect(leafs).toEqual([
      trie[A]![B]![C],
      trie[A]![B]![C]![D],
    ]);
  });

  test('suggests leaf tries for an empty key', () => {
    const trie = trieCreate();

    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const leafs = trieSuggest(trie, '', 0);

    expect(leafs).toEqual([
      trie[A],
      trie[A]![B]![C],
      trie[A]![B]![C]![D],
      trie[A]![B]![E],
    ]);
  });

  test('suggests leaf tries with endIndex', () => {
    const trie = trieCreate();

    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const leafs = trieSuggest(trie, 'abcd', 0, 2);

    expect(leafs).toEqual([
      trie[A]![B]![C],
      trie[A]![B]![C]![D],
      trie[A]![B]![E],
    ]);
  });

  test('does not suggest leafs that are too short', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);

    const leafs = trieSuggest(trie, 'abcd');

    expect(leafs).toBe(null);
  });

  test('suggests a leaf that has exact length', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);

    const leafs = trieSuggest(trie, 'abc');

    expect(leafs).toEqual([
      trie,
    ]);
  });

  test('returns the same array on each call', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);

    expect(trieSuggest(trie, 'abc')).toBe(trieSuggest(trie, 'abc'));
  });

  test('populates parent caches', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcd', 222);

    const leafs = trieSuggest(trie, 'abc');

    expect(leafs).toBe(trieSuggest(trie, 'ab'));
    expect(leafs).toBe(trieSuggest(trie, 'a'));
    expect(leafs).toBe(trieSuggest(trie, ''));
  });

  test('populates parent caches up to the closest fork', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcd', 222);
    trieSet(trie, 'e', 222);

    const leafs = trieSuggest(trie, 'abc');

    expect(leafs).toBe(trieSuggest(trie, 'ab'));
    expect(leafs).toBe(trieSuggest(trie, 'a'));
    expect(leafs).not.toBe(trieSuggest(trie, ''));
  });

  test('cleans up cache during set', () => {
    const trie = trieCreate();

    trieSet(trie, 'abc', 111);

    const leafs = trieSuggest(trie, 'abc');

    trieSet(trie, 'abcd', 222);

    expect(leafs).not.toBe(trieSuggest(trie, 'abc'));
  });

  test('perf', () => {
    const trie = trieCreate();

    dictionary.forEach((word) => {
      trieSet(trie, word, word);
    });

    expect(trieSuggest(trie, 'abbot')?.length).toBe(2);
    expect(trieSuggest(trie, 'abb')?.length).toBe(12);
  });
});
