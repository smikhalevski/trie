import {createTrie, TrieNode, searchTrie, setTrie, setAllTrie, getTrie} from '../main';

const A = 97;
const B = 98;
const C = 99;
const D = 100;
const E = 101;
const F = 102;

describe('setTrie', () => {

  test('sets an empty string to a trie', () => {
    const node = createTrie();
    setTrie(node, '', 123);

    expect(node).toEqual(<TrieNode<number>>{
      parent: null,
      leafCharCodes: null,
      word: '',
      value: 123,
      length: 0,
      isLeaf: true,
      children: null,
      childrenCharCodes: null,
    });
  });

  test('sets the value to an empty trie', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);

    expect(node).toEqual(<TrieNode<number>>{
      parent: null,
      leafCharCodes: [A, B, C],
      word: 'abc',
      value: 123,
      length: 3,
      isLeaf: true,
      children: null,
      childrenCharCodes: null,
    });
  });

  test('sets the value to an non-empty trie', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 123);
    setTrie(node, 'ade', 456);

    const expectedNode: TrieNode<number> = {
      parent: null,
      word: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      childrenCharCodes: [A],
      children: {
        [A]: {
          parent: null,
          word: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          childrenCharCodes: [B, D],
          children: {
            [B]: {
              parent: null,
              leafCharCodes: [C],
              word: 'abc',
              value: 123,
              length: 3,
              isLeaf: true,
              childrenCharCodes: null,
              children: null,
            },
            [D]: {
              parent: null,
              leafCharCodes: [E],
              word: 'ade',
              value: 456,
              length: 3,
              isLeaf: true,
              childrenCharCodes: null,
              children: null,
            },
          },
        },
      },
    };

    expectedNode.children![A]!.parent = node;

    expectedNode.children![A]!.children![B]!.parent = expectedNode.children![A]!;
    expectedNode.children![A]!.children![D]!.parent = expectedNode.children![A]!;

    expect(node).toEqual(expectedNode);
  });

  test('sets the value to a deep trie node', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 123);
    setTrie(node, 'ade', 456);
    setTrie(node, 'abf', 789);

    const expectedNode: TrieNode<number> = {
      parent: null,
      leafCharCodes: null,
      word: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      childrenCharCodes: [A],
      children: {
        [A]: {
          parent: null,
          leafCharCodes: null,
          word: null,
          value: undefined,
          length: 1,
          isLeaf: false,
          childrenCharCodes: [B, D],
          children: {
            [B]: {
              parent: null,
              leafCharCodes: null,
              word: null,
              value: undefined,
              length: 2,
              isLeaf: false,
              childrenCharCodes: [C, F],
              children: {
                [C]: {
                  parent: null,
                  leafCharCodes: null,
                  word: 'abc',
                  value: 123,
                  length: 3,
                  isLeaf: true,
                  childrenCharCodes: null,
                  children: null,
                },
                [F]: {
                  parent: null,
                  leafCharCodes: null,
                  word: 'abf',
                  value: 789,
                  length: 3,
                  isLeaf: true,
                  childrenCharCodes: null,
                  children: null,
                },
              },
            },
            [D]: {
              parent: null,
              leafCharCodes: [E],
              word: 'ade',
              value: 456,
              length: 3,
              isLeaf: true,
              childrenCharCodes: null,
              children: null,
            },
          },
        },
      },
    };

    expectedNode.children![A]!.parent = node;

    expectedNode.children![A]!.children![B]!.parent = expectedNode.children![A]!;
    expectedNode.children![A]!.children![D]!.parent = expectedNode.children![A]!;

    expectedNode.children![A]!.children![B]!.children![C]!.parent = expectedNode.children![A]!.children![B]!;
    expectedNode.children![A]!.children![B]!.children![F]!.parent = expectedNode.children![A]!.children![B]!;

    expect(node).toEqual(expectedNode);
  });

  test('preserves overlapping keys', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const expectedNode: TrieNode<number> = {
      parent: null,
      word: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      childrenCharCodes: [A],
      children: {
        [A]: {
          parent: null,
          word: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          childrenCharCodes: [B],
          children: {
            [B]: {
              parent: null,
              word: null,
              value: undefined,
              leafCharCodes: null,
              length: 2,
              isLeaf: false,
              childrenCharCodes: [C],
              children: {
                [C]: {
                  parent: null,
                  word: 'abc',
                  value: 123,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  childrenCharCodes: [D],
                  children: {
                    [D]: {
                      parent: null,
                      word: 'abcdef',
                      value: 456,
                      leafCharCodes: [E, F],
                      length: 6,
                      isLeaf: true,
                      childrenCharCodes: null,
                      children: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expectedNode.children![A]!.parent = node;

    expectedNode.children![A]!.children![B]!.parent = expectedNode.children![A]!;

    expectedNode.children![A]!.children![B]!.children![C]!.parent = expectedNode.children![A]!.children![B]!;

    expectedNode.children![A]!.children![B]!.children![C]!.children![D]!.parent = expectedNode.children![A]!.children![B]!.children![C]!;

    expect(node).toEqual(expectedNode);
  });

  test('sets the shorter key after longer key', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);
    setTrie(node, 'abcde', 789);

    const expectedNode: TrieNode<number> = {
      parent: null,
      word: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      childrenCharCodes: [A],
      children: {
        [A]: {
          parent: null,
          word: null,
          value: undefined,
          length: 1,
          leafCharCodes: null,
          isLeaf: false,
          childrenCharCodes: [B],
          children: {
            [B]: {
              parent: null,
              word: null,
              value: undefined,
              length: 2,
              leafCharCodes: null,
              isLeaf: false,
              childrenCharCodes: [C],
              children: {
                [C]: {
                  parent: null,
                  word: 'abc',
                  value: 123,
                  length: 3,
                  leafCharCodes: null,
                  isLeaf: true,
                  childrenCharCodes: [D],
                  children: {
                    [D]: {
                      parent: null,
                      word: null,
                      value: undefined,
                      length: 4,
                      leafCharCodes: null,
                      isLeaf: false,
                      childrenCharCodes: [E],
                      children: {
                        [E]: {
                          parent: null,
                          word: 'abcde',
                          value: 789,
                          length: 5,
                          leafCharCodes: null,
                          isLeaf: true,
                          childrenCharCodes: [F],
                          children: {
                            [F]: {
                              parent: null,
                              word: 'abcdef',
                              value: 456,
                              length: 6,
                              leafCharCodes: null,
                              children: null,
                              childrenCharCodes: null,
                              isLeaf: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expectedNode.children![A]!.parent = node;

    expectedNode.children![A]!.children![B]!.parent = expectedNode.children![A]!;

    expectedNode.children![A]!.children![B]!.children![C]!.parent = expectedNode.children![A]!.children![B]!;

    expectedNode.children![A]!.children![B]!.children![C]!.children![D]!.parent = expectedNode.children![A]!.children![B]!.children![C]!;

    expectedNode.children![A]!.children![B]!.children![C]!.children![D]!.children![E]!.parent = expectedNode.children![A]!.children![B]!.children![C]!.children![D]!;

    expectedNode.children![A]!.children![B]!.children![C]!.children![D]!.children![E]!.children![F]!.parent = expectedNode.children![A]!.children![B]!.children![C]!.children![D]!.children![E]!;

    expect(node).toEqual(expectedNode);
  });

});

describe('setAllTrie', () => {

  test('', () => {
    const node = createTrie();
    setAllTrie(node, [['abc', 123], ['abd', 456]]);

    const leafNode = searchTrie(node, 'abd', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![D]);
  });
});

describe('searchTrie', () => {

  test('finds a node with zero-length key', () => {
    const node = createTrie();
    setTrie(node, '', 123);

    expect(searchTrie(node, '', 0)).toBe(node);
  });

  test('finds a node with one entry', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);

    expect(searchTrie(node, 'abc', 0)).toBe(node);
  });

  test('finds a node with two leaf entries', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abd', 456);

    const leafNode = searchTrie(node, 'abd', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![D]);
  });

  test('finds a node with deep char entries', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    const leafNode = searchTrie(node, 'abdef', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![D]);
  });

  test('finds a node at offset', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    const leafNode = searchTrie(node, 'qqqabdef', 3);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![D]);
  });

  test('finds the node with the longest key', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcdef', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![C]!.children![D]);
  });

  test('finds the node with the shortest matched key', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcdeZZZ', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![C]);
  });

  test('finds the node with the shortest key on string end', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcde', 0);

    expect(leafNode).toBe(node.children![A]!.children![B]!.children![C]);
  });

  test('returns undefined if no node was found', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    const leafNode = searchTrie(node, 'abe', 0);

    expect(leafNode).toBeUndefined();
  });
});

describe('getTrie', () => {

  test('returns the node that matches the word exactly', () => {
    const node = createTrie();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    expect(getTrie(node, 'abc')).toBe(node.children![A]!.children![B]!.children![C]);
    expect(getTrie(node, 'abdef')).toBe(node.children![A]!.children![B]!.children![D]);
    expect(getTrie(node, 'abd')).toBeUndefined();
  });
});
