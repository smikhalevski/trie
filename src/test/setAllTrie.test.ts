import {createTrie, searchTrie, setAllTrie} from '../main';

describe('setAllTrie', () => {

  test('sets all values from entries', () => {
    const node = createTrie();
    setAllTrie(node, [['abc', 111], ['abd', 222]]);

    expect(searchTrie(node, 'abc', 0)).toBe(node.next![0]!.next![0]!.next![0]);
    expect(searchTrie(node, 'abd', 0)).toBe(node.next![0]!.next![0]!.next![1]);
  });
});
