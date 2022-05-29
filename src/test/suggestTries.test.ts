import {createTrie, setTrie, suggestTries} from '../main';

describe('suggestTries', () => {

  test('suggests leaf tries', () => {
    const node = createTrie();

    setTrie(node, 'abcd', 111);
    setTrie(node, 'abc', 222);
    setTrie(node, 'abef', 333);
    setTrie(node, 'a', 444);

    const suggestions = suggestTries(node, 'abc', 0);

    expect(suggestions).toEqual([
      node.next![0].next![0].next![0],
      node.next![0].next![0].next![0].next![0],
    ]);
  });

  test('suggests leaf tries with endIndex', () => {
    const node = createTrie();

    setTrie(node, 'abcd', 111);
    setTrie(node, 'abc', 222);
    setTrie(node, 'abef', 333);
    setTrie(node, 'a', 444);

    const suggestions = suggestTries(node, 'abcd', 0, 2);

    expect(suggestions).toEqual([
      node.next![0].next![0].next![0],
      node.next![0].next![0].next![0].next![0],
      node.next![0].next![0].next![1],
    ]);
  });
});
