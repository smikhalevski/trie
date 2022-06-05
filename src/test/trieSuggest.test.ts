import {trieCreate, trieSet, trieSuggest} from '../main';

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
});
