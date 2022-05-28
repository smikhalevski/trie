import {createTrieNode, TrieNode, searchTrieNode, setTrieNode} from '../main';

const A = 97;
const B = 98;
const C = 99;
const D = 100;
const E = 101;
const F = 102;

describe('setTrieNode', () => {

  test('adds an empty string to a trie', () => {
    const trie = createTrieNode();
    setTrieNode(trie, '', 123);

    expect(trie).toEqual(<TrieNode<number>>{
      finalCharCodes: null,
      key: '',
      value: 123,
      length: 0,
      final: true,
      children: null,
    });
  });

  test('adds value to an empty trie', () => {
    const trie = createTrieNode();
    setTrieNode(trie, 'abc', 123);

    expect(trie).toEqual(<TrieNode<number>>{
      finalCharCodes: [A, B, C],
      key: 'abc',
      value: 123,
      length: 3,
      final: true,
      children: null,
    });
  });

  test('adds value to an non-empty trie', () => {
    const trie = createTrieNode();
    setTrieNode(trie, 'abc', 123);
    setTrieNode(trie, 'ade', 456);

    expect(trie).toEqual(<TrieNode<number>>{
      key: null,
      value: undefined,
      finalCharCodes: null,
      length: 0,
      final: false,
      children: {
        [A]: {
          key: null,
          value: undefined,
          finalCharCodes: null,
          length: 1,
          final: false,
          children: {
            [B]: {
              finalCharCodes: [C],
              key: 'abc',
              value: 123,
              length: 3,
              final: true,
              children: null,
            },
            [D]: {
              finalCharCodes: [E],
              key: 'ade',
              value: 456,
              length: 3,
              final: true,
              children: null,
            },
          },
        },
      },
    });
  });

  test('adds value to a deep trie', () => {
    const trie = createTrieNode();
    setTrieNode(trie, 'abc', 123);
    setTrieNode(trie, 'ade', 456);
    setTrieNode(trie, 'abf', 789);

    expect(trie).toEqual(<TrieNode<number>>{
      finalCharCodes: null,
      key: null,
      value: undefined,
      length: 0,
      final: false,
      children: {
        [A]: {
          finalCharCodes: null,
          key: null,
          value: undefined,
          length: 1,
          final: false,
          children: {
            [B]: {
              finalCharCodes: null,
              key: null,
              value: undefined,
              length: 2,
              final: false,
              children: {
                [C]: {
                  finalCharCodes: null,
                  key: 'abc',
                  value: 123,
                  length: 3,
                  final: true,
                  children: null,
                },
                [F]: {
                  finalCharCodes: null,
                  key: 'abf',
                  value: 789,
                  length: 3,
                  final: true,
                  children: null,
                },
              },
            },
            [D]: {
              finalCharCodes: [E],
              key: 'ade',
              value: 456,
              length: 3,
              final: true,
              children: null,
            },
          },
        },
      },
    });
  });

  test('preserves overlapping keys', () => {
    const trie = createTrieNode();
    setTrieNode(trie, 'abc', 123);
    setTrieNode(trie, 'abcdef', 456);

    expect(trie).toEqual(<TrieNode<number>>{
      key: null,
      value: undefined,
      finalCharCodes: null,
      length: 0,
      final: false,
      children: {
        [A]: {
          key: null,
          value: undefined,
          finalCharCodes: null,
          length: 1,
          final: false,
          children: {
            [B]: {
              key: null,
              value: undefined,
              finalCharCodes: null,
              length: 2,
              final: false,
              children: {
                [C]: {
                  key: 'abc',
                  value: 123,
                  finalCharCodes: null,
                  length: 3,
                  final: true,
                  children: {
                    [D]: {
                      key: 'abcdef',
                      value: 456,
                      finalCharCodes: [E, F],
                      length: 6,
                      final: true,
                      children: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  test('adds shorter key after longer key', () => {
    const trie = createTrieNode();
    setTrieNode(trie, 'abc', 123);
    setTrieNode(trie, 'abcdef', 456);
    setTrieNode(trie, 'abcde', 789);

    expect(trie).toEqual(<TrieNode<number>>{
      key: null,
      value: undefined,
      length: 0,
      finalCharCodes: null,
      final: false,
      children: {
        [A]: {
          key: null,
          value: undefined,
          length: 1,
          finalCharCodes: null,
          final: false,
          children: {
            [B]: {
              key: null,
              value: undefined,
              length: 2,
              finalCharCodes: null,
              final: false,
              children: {
                [C]: {
                  key: 'abc',
                  value: 123,
                  length: 3,
                  finalCharCodes: null,
                  final: true,
                  children: {
                    [D]: {
                      key: null,
                      value: undefined,
                      length: 4,
                      finalCharCodes: null,
                      final: false,
                      children: {
                        [E]: {
                          key: 'abcde',
                          value: 789,
                          length: 5,
                          finalCharCodes: null,
                          final: true,
                          children: {
                            [F]: {
                              key: 'abcdef',
                              value: 456,
                              length: 6,
                              finalCharCodes: null,
                              children: null,
                              final: true,
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
    });
  });

});

describe('searchTrieNode', () => {

  test('finds a node with one entry', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);

    expect(searchTrieNode(node, 'abc', 0)).toBe(node);
  });

  test('finds a node with two leaf entries', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abd', 456);

    const leafNode = searchTrieNode(node, 'abd', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds a node with deep char entries', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abdef', 456);

    const leafNode = searchTrieNode(node, 'abdef', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds a node at offset', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abdef', 456);

    const leafNode = searchTrieNode(node, 'qqqabdef', 3);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds the node with the longest key', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abcdef', 456);

    const leafNode = searchTrieNode(node, 'abcdef', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]?.children?.[D]);
  });

  test('finds the node with the shortest matched key', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abcdef', 456);

    const leafNode = searchTrieNode(node, 'abcdeZZZ', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]);
  });

  test('finds the node with the shortest key on string end', () => {
    const node = createTrieNode();
    setTrieNode(node, 'abc', 123);
    setTrieNode(node, 'abcdef', 456);

    const leafNode = searchTrieNode(node, 'abcde', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]);
  });
});
