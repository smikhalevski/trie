import {createTrie, getTrie, setTrie} from '../main';

describe('getTrie', () => {

  test('returns the node that matches the key exactly', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abdef', 222);

    expect(getTrie(node, 'abc')).toBe(node.next![0]!.next![0]!.next![0]);
    expect(getTrie(node, 'abdef')).toBe(node.next![0]!.next![0]!.next![1]);
    expect(getTrie(node, 'abd')).toBeUndefined();
  });
});
