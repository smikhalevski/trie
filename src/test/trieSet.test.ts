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

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
    };

    expect(trie).toEqual(result);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, '', 111)).toBe(trie);
    expect(trieSet(trie, 'a', 222)).toBe(trie[A]);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      [A]: {
        charCode: A,
        left: null,
        prev: null,
        next: null,
        last: null,
        key: 'a',
        value: 222,
        isLeaf: true,
        leafCharCodes: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.left = trie;
    result[A]!.prev = trie;

    expect(trie).toEqual(result);
  });

  test('sets the value to an empty trie', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: 'abc',
      value: 111,
      isLeaf: true,
      leafCharCodes: [A, B, C],
    };

    expect(trie).toEqual(result);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, 'abc', 111)).toBe(trie);
    expect(trieSet(trie, 'ade', 222)).toBe(trie![A]![D]);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      [A]: {
        charCode: A,
        left: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        [B]: {
          charCode: B,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: 'abc',
          value: 111,
          isLeaf: true,
          leafCharCodes: [C],
        },
        [D]: {
          charCode: D,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
        }
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.left = trie;
    result[A]!.prev = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.left = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![D]!;

    result[A]![D]!.left = result[A]!;
    result[A]![D]!.prev = result[A]![B]!;

    expect(trie).toEqual(result);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'ade', 222);
    trieSet(trie, 'abf', 333);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      [A]: {
        charCode: A,
        left: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        [B]: {
          charCode: B,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          [C]: {
            charCode: C,
            left: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
          },
          [F]: {
            charCode: F,
            left: null,
            prev: null,
            next: null,
            last: null,
            key: 'abf',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
          }
        },
        [D]: {
          charCode: D,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.left = trie;
    result[A]!.prev = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.left = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![F]!;

    result[A]![B]![C]!.left = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![F]!;

    result[A]![B]![F]!.left = result[A]![B]!;
    result[A]![B]![F]!.prev = result[A]![B]![C]!;
    result[A]![B]![F]!.next = result[A]![D]!;

    result[A]![D]!.left = result[A]!;
    result[A]![D]!.prev = result[A]![B]![F]!;

    expect(trie).toEqual(result);
  });

  test('preserves overlapping keys', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      [A]: {
        charCode: A,
        left: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        [B]: {
          charCode: B,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          [C]: {
            charCode: C,
            left: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            [D]: {
              charCode: D,
              left: null,
              prev: null,
              next: null,
              last: null,
              key: 'abcdef',
              value: 222,
              isLeaf: true,
              leafCharCodes: [E, F],
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.left = trie;
    result[A]!.prev = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.left = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.left = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.left = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('sets the shorter key after longer key', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);
    trieSet(trie, 'abcde', 333);

    const result: Trie<number> = {
      charCode: -1,
      left: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      [A]: {
        charCode: A,
        left: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        [B]: {
          charCode: B,
          left: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          [C]: {
            charCode: C,
            left: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            [D]: {
              charCode: D,
              left: null,
              prev: null,
              next: null,
              last: null,
              key: null,
              value: undefined,
              isLeaf: false,
              leafCharCodes: null,
              [E]: {
                charCode: E,
                left: null,
                prev: null,
                next: null,
                last: null,
                key: 'abcde',
                value: 333,
                isLeaf: true,
                leafCharCodes: null,
                [F]: {
                  charCode: F,
                  left: null,
                  prev: null,
                  next: null,
                  last: null,
                  key: 'abcdef',
                  value: 222,
                  isLeaf: true,
                  leafCharCodes: null,
                },
              },
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.left = trie;
    result[A]!.prev = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.left = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.left = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.left = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.prev = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.next = result[A]![B]![C]![D]![E]!;
    result[A]![B]![C]![D]!.last = result[A]![B]![C]![D]![E]!;

    result[A]![B]![C]![D]![E]!.left = result[A]![B]![C]![D]!;
    result[A]![B]![C]![D]![E]!.prev = result[A]![B]![C]![D]!;
    result[A]![B]![C]![D]![E]!.next = result[A]![B]![C]![D]![E]![F]!;
    result[A]![B]![C]![D]![E]!.last = result[A]![B]![C]![D]![E]![F]!;

    result[A]![B]![C]![D]![E]![F]!.left = result[A]![B]![C]![D]![E]!;
    result[A]![B]![C]![D]![E]![F]!.prev = result[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(result);
  });
});
