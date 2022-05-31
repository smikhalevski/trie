import {createTrie, setTrie, suggestTries} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('suggestTries', () => {

  test('suggests leaf tries', () => {
    const trie = createTrie();

    setTrie(trie, 'abcd', 111);
    setTrie(trie, 'abc', 222);
    setTrie(trie, 'abef', 333);
    setTrie(trie, 'a', 444);

    const suggestions = suggestTries(trie, 'abc', 0);

    expect(suggestions).toEqual([
      trie.next![A]!.next![B]!.next![C],
      trie.next![A]!.next![B]!.next![C]!.next![D],
    ]);
  });

  test('suggests leaf tries with endIndex', () => {
    const trie = createTrie();

    setTrie(trie, 'abcd', 111);
    setTrie(trie, 'abc', 222);
    setTrie(trie, 'abef', 333);
    setTrie(trie, 'a', 444);

    const suggestions = suggestTries(trie, 'abcd', 0, 2);

    expect(suggestions).toEqual([
      trie.next![A]!.next![B]!.next![C],
      trie.next![A]!.next![B]!.next![C]!.next![D],
      trie.next![A]!.next![B]!.next![E],
    ]);
  });
});
