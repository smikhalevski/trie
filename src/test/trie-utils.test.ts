import {createTrieNode, ITrieNode, searchTrie, setTrie} from '../main/trie-utils';

const A = 97;
const B = 98;
const C = 99;
const D = 100;
const E = 101;
const F = 102;

describe('setTrie', () => {

  test('adds an empty string to a trie node', () => {
    const node = createTrieNode();
    setTrie(node, '', 123);

    expect(node).toEqual(<ITrieNode<number>>{
      chars: null,
      key: '',
      value: 123,
      charCount: 0,
      end: true,
      children: null,
    });
  });

  test('adds value to an empty trie node', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);

    expect(node).toEqual(<ITrieNode<number>>{
      chars: [A, B, C],
      key: 'abc',
      value: 123,
      charCount: 3,
      end: true,
      children: null,
    });
  });

  test('adds value to an non-empty trie node', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'ade', 456);

    expect(node).toEqual(<ITrieNode<number>>{
      key: undefined,
      value: undefined,
      chars: null,
      charCount: 0,
      end: false,
      children: {
        [A]: {
          key: undefined,
          value: undefined,
          chars: null,
          charCount: 1,
          end: false,
          children: {
            [B]: {
              chars: [C],
              key: 'abc',
              value: 123,
              charCount: 3,
              end: true,
              children: null,
            },
            [D]: {
              chars: [E],
              key: 'ade',
              value: 456,
              charCount: 3,
              end: true,
              children: null,
            },
          },
        },
      },
    });
  });

  test('adds value to a deep trie node', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'ade', 456);
    setTrie(node, 'abf', 789);

    expect(node).toEqual(<ITrieNode<number>>{
      chars: null,
      key: undefined,
      value: undefined,
      charCount: 0,
      end: false,
      children: {
        [A]: {
          chars: null,
          key: undefined,
          value: undefined,
          charCount: 1,
          end: false,
          children: {
            [B]: {
              chars: null,
              key: undefined,
              value: undefined,
              charCount: 2,
              end: false,
              children: {
                [C]: {
                  chars: null,
                  key: 'abc',
                  value: 123,
                  charCount: 3,
                  end: true,
                  children: null,
                },
                [F]: {
                  chars: null,
                  key: 'abf',
                  value: 789,
                  charCount: 3,
                  end: true,
                  children: null,
                },
              },
            },
            [D]: {
              chars: [E],
              key: 'ade',
              value: 456,
              charCount: 3,
              end: true,
              children: null,
            },
          },
        },
      },
    });
  });

  test('preserves overlapping keys', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    expect(node).toEqual(<ITrieNode<number>>{
      key: undefined,
      value: undefined,
      chars: null,
      charCount: 0,
      end: false,
      children: {
        [A]: {
          key: undefined,
          value: undefined,
          chars: null,
          charCount: 1,
          end: false,
          children: {
            [B]: {
              key: undefined,
              value: undefined,
              chars: null,
              charCount: 2,
              end: false,
              children: {
                [C]: {
                  key: 'abc',
                  value: 123,
                  chars: null,
                  charCount: 3,
                  end: true,
                  children: {
                    [D]: {
                      key: 'abcdef',
                      value: 456,
                      chars: [E, F],
                      charCount: 6,
                      end: true,
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
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);
    setTrie(node, 'abcde', 789);

    expect(node).toEqual(<ITrieNode<number>>{
      key: undefined,
      value: undefined,
      charCount: 0,
      chars: null,
      end: false,
      children: {
        [A]: {
          key: undefined,
          value: undefined,
          charCount: 1,
          chars: null,
          end: false,
          children: {
            [B]: {
              key: undefined,
              value: undefined,
              charCount: 2,
              chars: null,
              end: false,
              children: {
                [C]: {
                  key: 'abc',
                  value: 123,
                  charCount: 3,
                  chars: null,
                  end: true,
                  children: {
                    [D]: {
                      key: undefined,
                      value: undefined,
                      charCount: 4,
                      chars: null,
                      end: false,
                      children: {
                        [E]: {
                          key: 'abcde',
                          value: 789,
                          charCount: 5,
                          chars: null,
                          end: true,
                          children: {
                            [F]: {
                              key: 'abcdef',
                              value: 456,
                              charCount: 6,
                              chars: null,
                              children: null,
                              end: true,
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

describe('searchTrie', () => {

  test('finds a node with one entry', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);

    expect(searchTrie(node, 'abc', 0)).toBe(node);
  });

  test('finds a node with two leaf entries', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abd', 456);

    const leafNode = searchTrie(node, 'abd', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds a node with deep char entries', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    const leafNode = searchTrie(node, 'abdef', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds a node at offset', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abdef', 456);

    const leafNode = searchTrie(node, 'qqqabdef', 3);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[D]);
  });

  test('finds the node with the longest key', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcdef', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]?.children?.[D]);
  });

  test('finds the node with the shortest matched key', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcdeZZZ', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]);
  });

  test('finds the node with the shortest key on string end', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const leafNode = searchTrie(node, 'abcde', 0);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]);
  });

  test('uses charCodeAt callback', () => {
    const node = createTrieNode();
    setTrie(node, 'abc', 123);
    setTrie(node, 'abcdef', 456);

    const charCodeAtCallback = jest.fn((input, offset) => input.toLowerCase().charCodeAt(offset));

    const leafNode = searchTrie(node, 'ABCDE', 0, charCodeAtCallback);

    expect(leafNode).toBe(node.children?.[A]?.children?.[B]?.children?.[C]);
    expect(charCodeAtCallback).toHaveBeenCalledTimes(4);
  });
});
