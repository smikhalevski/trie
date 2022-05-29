import {createTrie, setTrie, suggestTries} from '../main';

describe('suggestTries', () => {

  test('suggests leaf tries', () => {
    const trie = createTrie();

    setTrie(trie, 'abcd', 111);
    setTrie(trie, 'abc', 222);
    setTrie(trie, 'abef', 333);
    setTrie(trie, 'a', 444);

    const suggestions = suggestTries(trie, 'abc', 0);

    expect(suggestions).toEqual([
      trie.next![0].next![0].next![0],
      trie.next![0].next![0].next![0].next![0],
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
      trie.next![0].next![0].next![0],
      trie.next![0].next![0].next![0].next![0],
      trie.next![0].next![0].next![1],
    ]);
  });
});
