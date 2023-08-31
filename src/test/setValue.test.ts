import { createTrie, getLeaf, setValue, Trie } from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);
const F = 'f'.charCodeAt(0);

describe('setValue', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('sets an empty key to an empty trie', () => {
    expect(setValue(trie, '', 111)).toBe(trie);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      suggestions: null,
    };

    expect(trie).toEqual(result);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    expect(setValue(trie, '', 111)).toBe(trie);
    expect(setValue(trie, 'a', 222)).toBe(trie[A]);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: '',
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: 'a',
        value: 222,
        isLeaf: true,
        leafCharCodes: null,
        suggestions: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;

    expect(trie).toEqual(result);
  });

  test('updated the existing key', () => {
    setValue(trie, 'abc', 222);
    setValue(trie, 'abc', 222);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: 'abc',
        value: 222,
        isLeaf: true,
        leafCharCodes: [B, C],
        suggestions: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;

    expect(trie).toEqual(result);
  });

  test('sets the value with the non-empty key to an empty trie', () => {
    expect(setValue(trie, 'abc', 111)).toBe(trie[A]);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: 'abc',
        value: 111,
        isLeaf: true,
        leafCharCodes: [B, C],
        suggestions: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;

    expect(trie).toEqual(result);
  });

  test('sets the value to a non-empty trie', () => {
    expect(setValue(trie, 'abc', 111)).toBe(trie[A]);
    expect(setValue(trie, 'ade', 222)).toBe(trie![A]![D]);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: 'abc',
          value: 111,
          isLeaf: true,
          leafCharCodes: [C],
          suggestions: null,
        },
        [D]: {
          charCode: D,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          suggestions: null,
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![D]!;

    result[A]![D]!.parent = result[A]!;
    result[A]![D]!.prev = result[A]![B]!;

    expect(trie).toEqual(result);
  });

  test('sets the value to a deep trie trie', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'ade', 222);
    setValue(trie, 'abf', 333);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
          [F]: {
            charCode: F,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abf',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
        },
        [D]: {
          charCode: D,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: 'ade',
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          suggestions: null,
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![F]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![F]!;

    result[A]![B]![F]!.parent = result[A]![B]!;
    result[A]![B]![F]!.prev = result[A]![B]![C]!;
    result[A]![B]![F]!.next = result[A]![D]!;

    result[A]![D]!.parent = result[A]!;
    result[A]![D]!.prev = result[A]![B]![F]!;

    expect(trie).toEqual(result);
  });

  test('preserves overlapping keys', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcdef', 222);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
            [D]: {
              charCode: D,
              parent: null,
              prev: null,
              next: null,
              last: null,
              key: 'abcdef',
              value: 222,
              isLeaf: true,
              leafCharCodes: [E, F],
              suggestions: null,
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('sets the shorter key after longer key', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcdef', 222);
    setValue(trie, 'abcde', 333);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
            [D]: {
              charCode: D,
              parent: null,
              prev: null,
              next: null,
              last: null,
              key: null,
              value: undefined,
              isLeaf: false,
              leafCharCodes: null,
              suggestions: null,
              [E]: {
                charCode: E,
                parent: null,
                prev: null,
                next: null,
                last: null,
                key: 'abcde',
                value: 333,
                isLeaf: true,
                leafCharCodes: null,
                suggestions: null,
                [F]: {
                  charCode: F,
                  parent: null,
                  prev: null,
                  next: null,
                  last: null,
                  key: 'abcdef',
                  value: 222,
                  isLeaf: true,
                  leafCharCodes: null,
                  suggestions: null,
                },
              },
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.prev = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.next = result[A]![B]![C]![D]![E]!;
    result[A]![B]![C]![D]!.last = result[A]![B]![C]![D]![E]!;

    result[A]![B]![C]![D]![E]!.parent = result[A]![B]![C]![D]!;
    result[A]![B]![C]![D]![E]!.prev = result[A]![B]![C]![D]!;
    result[A]![B]![C]![D]![E]!.next = result[A]![B]![C]![D]![E]![F]!;
    result[A]![B]![C]![D]![E]!.last = result[A]![B]![C]![D]![E]![F]!;

    result[A]![B]![C]![D]![E]![F]!.parent = result[A]![B]![C]![D]![E]!;
    result[A]![B]![C]![D]![E]![F]!.prev = result[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(result);
  });

  test('correctly infers next for distant keys', () => {
    setValue(trie, 'abcd', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abef', 333);
    setValue(trie, 'a', 444);

    const result: Trie = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: 'a',
        value: 444,
        isLeaf: true,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
            [D]: {
              charCode: D,
              parent: null,
              prev: null,
              next: null,
              last: null,
              key: 'abcd',
              value: 111,
              isLeaf: true,
              leafCharCodes: null,
              suggestions: null,
            },
          },
          [E]: {
            charCode: E,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abef',
            value: 333,
            isLeaf: true,
            leafCharCodes: [F],
            suggestions: null,
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![E]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.prev = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.next = result[A]![B]![E]!;

    result[A]![B]![E]!.parent = result[A]![B]!;
    result[A]![B]![E]!.prev = result[A]![B]![C]![D]!;

    expect(trie).toEqual(result);
  });

  test('preserves stable identity when a forked', () => {
    const leaf = setValue(trie, 'abc', 111);
    setValue(trie, 'ab', 222);
    setValue(trie, 'abc', 333);

    expect(leaf.value).toBe(333);
  });

  test('preserves stable identity when a child is added', () => {
    const leaf = setValue(trie, 'abc', 111);
    setValue(trie, 'abcd', 222);
    setValue(trie, 'abc', 333);

    expect(leaf.value).toBe(333);
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      setValue(trie, key, key);
    });

    dictionary.forEach(key => {
      expect(getLeaf(trie, key)!.key).toEqual(key);
    });
  });
});
