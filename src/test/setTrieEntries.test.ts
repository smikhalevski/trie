import {createTrie, getTrie, setTrieEntries} from '../main';

describe('setTrieEntries', () => {

  test('sets all values from entries', () => {
    const trie = createTrie();
    setTrieEntries(trie, [['abc', 111], ['abd', 222]]);

    expect(getTrie(trie, 'abc')).toBe(trie.next![0]!.next![0]!.next![0]);
    expect(getTrie(trie, 'abd')).toBe(trie.next![0]!.next![0]!.next![1]);
  });
});
