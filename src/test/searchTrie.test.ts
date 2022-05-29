import {createTrie, searchTrie, setTrie} from '../main';

describe('searchTrie', () => {

  test('finds a node with zero-length key', () => {
    const node = createTrie();
    setTrie(node, '', 111);

    expect(searchTrie(node, '', 0)).toBe(node);
  });

  test('finds a node with one entry', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);

    expect(searchTrie(node, 'abc', 0)).toBe(node);
  });

  test('finds a node with two leaf entries', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abd', 222);

    const leafNode = searchTrie(node, 'abd', 0);

    expect(leafNode).toBe(node.next![0].next![0].next![1]);
  });

  test('finds a node with deep char entries', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abdef', 222);

    const leafNode = searchTrie(node, 'abdef', 0);

    expect(leafNode).toBe(node.next![0].next![0].next![1]);
  });

  test('finds a node at startIndex', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abdef', 222);

    const leafNode = searchTrie(node, 'qqqabdef', 3);

    expect(leafNode).toBe(node.next![0].next![0].next![1]);
  });

  test('finds a node with length limited by endIndex', () => {
    const node = createTrie();
    setTrie(node, 'ab', 111);
    setTrie(node, 'abc', 222);

    const leafNode = searchTrie(node, 'abc', 0, 2);

    expect(leafNode).toBe(node.next![0].next![0]);
  });

  test('finds the node with the longest key', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abcdef', 222);

    const leafNode = searchTrie(node, 'abcdef', 0);

    expect(leafNode).toBe(node.next![0].next![0].next![0].next![0]);
  });

  test('finds the node with the shortest matched key', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abcdef', 222);

    const leafNode = searchTrie(node, 'abcdeZZZ', 0);

    expect(leafNode).toBe(node.next![0].next![0].next![0]);
  });

  test('finds the node with the shortest key on string end', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abcdef', 222);

    const leafNode = searchTrie(node, 'abcde', 0);

    expect(leafNode).toBe(node.next![0].next![0].next![0]);
  });

  test('returns undefined if no node was found', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abdef', 222);

    const leafNode = searchTrie(node, 'abe', 0);

    expect(leafNode).toBe(null);
  });
});
