import {Trie, trieCreate, trieSet} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);
const F = 'f'.charCodeAt(0);

describe('trieSet', () => {

  test('sets an empty key to a trie', () => {
    const trie = trieCreate();

    expect(trieSet(trie, '', 111)).toBe(trie);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: false,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      // length: 0,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, '', 111)).toBe(trie);
    expect(trieSet(trie, 'a', 222)).toBe(trie[A]);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: true,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      // length: 0,
      [A]: {
        left: null,
        charCode: A,
        hasContinuation: false,
        prev: null,
        next: null,
        last: null,
        key: 'a',
        value: 222,
        isLeaf: true,
        leafCharCodes: null,
        // length: 1,
      },
    };

    expectedTrie[A]!.left = trie;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an empty trie', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: false,
      prev: null,
      next: null,
      last: null,
      key: 'abc',
      value: 111,
      isLeaf: true,
      leafCharCodes: [A, B, C],
      // length: 3,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, 'abc', 111)).toBe(trie);
    expect(trieSet(trie, 'ade', 222)).toBe(trie![A]![D]);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: true,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      // length: 0,
      [A]: {
        left: null,
        charCode: A,
        hasContinuation: true,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        // length: 1,
        [B]: {
          left: null,
          charCode: B,
          hasContinuation: false,
          prev: null,
          next: null,
          last: null,
          key: 'abc',
          value: 111,
          isLeaf: true,
          leafCharCodes: [C],
          // length: 3,
        },
        [D]: {
          left: null,
          charCode: D,
          hasContinuation: false,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          // length: 3,
        }
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;
    expectedTrie[A]![D]!.left = expectedTrie[A]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'ade', 222);
    trieSet(trie, 'abf', 333);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: true,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      // length: 0,
      [A]: {
        left: null,
        charCode: A,
        hasContinuation: true,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        // length: 1,
        [B]: {
          left: null,
          charCode: B,
          hasContinuation: true,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          // length: 2,
          [C]: {
            left: null,
            charCode: C,
            hasContinuation: false,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            // length: 3,
          },
          [F]: {
            left: null,
            charCode: F,
            hasContinuation: false,
            prev: null,
            next: null,
            last: null,
            key: 'abf',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
            // length: 3,
          }
        },
        [D]: {
          left: null,
          charCode: D,
          hasContinuation: false,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          // length: 3,
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;
    expectedTrie[A]![D]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;
    expectedTrie[A]![B]![F]!.left = expectedTrie[A]![B]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('preserves overlapping keys', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: true,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      // length: 0,
      [A]: {
        left: null,
        charCode: A,
        hasContinuation: true,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        // length: 1,
        [B]: {
          left: null,
          charCode: B,
          hasContinuation: true,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          // length: 2,
          [C]: {
            left: null,
            charCode: C,
            hasContinuation: true,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            // length: 3,
            [D]: {
              left: null,
              charCode: D,
              hasContinuation: false,
              prev: null,
              next: null,
              last: null,
              key: 'abcdef',
              value: 222,
              isLeaf: true,
              leafCharCodes: [E, F],
              // length: 6,
            },
          },
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.left = expectedTrie[A]![B]![C]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the shorter key after longer key', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);
    trieSet(trie, 'abcde', 333);

    const expectedTrie: Trie<number> = {
      left: null,
      charCode: -1,
      hasContinuation: true,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      // length: 0,
      [A]: {
        left: null,
        charCode: A,
        hasContinuation: true,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        // length: 1,
        [B]: {
          left: null,
          charCode: B,
          hasContinuation: true,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          // length: 2,
          [C]: {
            left: null,
            charCode: C,
            hasContinuation: true,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            // length: 3,
            [D]: {
              left: null,
              charCode: D,
              hasContinuation: true,
              prev: null,
              next: null,
              last: null,
              key: null,
              value: undefined,
              isLeaf: false,
              leafCharCodes: null,
              // length: 4,
              [E]: {
                left: null,
                charCode: E,
                hasContinuation: true,
                prev: null,
                next: null,
                last: null,
                key: 'abcde',
                value: 333,
                isLeaf: true,
                leafCharCodes: null,
                // length: 5,
                [F]: {
                  left: null,
                  charCode: F,
                  hasContinuation: false,
                  prev: null,
                  next: null,
                  last: null,
                  key: 'abcdef',
                  value: 222,
                  // length: 6,
                  isLeaf: true,
                  leafCharCodes: null,
                },
              },
            },
          },
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.left = expectedTrie[A]![B]![C]!;

    expectedTrie[A]![B]![C]![D]![E]!.left = expectedTrie[A]![B]![C]![D]!;

    expectedTrie[A]![B]![C]![D]![E]![F]!.left = expectedTrie[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(expectedTrie);
  });
});
