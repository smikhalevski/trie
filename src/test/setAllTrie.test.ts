import {createTrie, getTrie, setAllTrie} from '../main';

describe('setAllTrie', () => {

  test('sets all values from entries', () => {
    const trie = createTrie();
    setAllTrie(trie, [['abc', 111], ['abd', 222]]);

    expect(getTrie(trie, 'abc')).toBe(trie.next![0]!.next![0]!.next![0]);
    expect(getTrie(trie, 'abd')).toBe(trie.next![0]!.next![0]!.next![1]);
  });
});
