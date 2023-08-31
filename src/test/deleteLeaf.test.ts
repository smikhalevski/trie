import { createTrie, deleteLeaf, getLeaf, setValue, Trie } from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);

describe('deleteLeaf', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('ignores null', () => {
    expect(() => deleteLeaf(null)).not.toThrow();
  });

  test('root leaf is not compacted (3)', () => {
    setValue(trie, '', 111);
    deleteLeaf(getLeaf(trie, ''));

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
    };

    expect(trie).toEqual(result);
  });

  test('multiple children after deletion are not compacted (1.1)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abd', 333);
    deleteLeaf(getLeaf(trie, 'ab'));

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
        leafCharCodes: null,
        isLeaf: false,
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
          },
          [D]: {
            charCode: D,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abd',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
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
    result[A]![B]!.last = result[A]![B]![D]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![D]!;

    result[A]![B]![D]!.parent = result[A]![B]!;
    result[A]![B]![D]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('single child after deletion can be compacted (1.2)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    deleteLeaf(getLeaf(trie, 'ab'));

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

  test('deletes the last sibling when parent is a leaf (2.3)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abd', 333);
    deleteLeaf(getLeaf(trie, 'abd'));

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
          key: 'ab',
          value: 111,
          isLeaf: true,
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
          },
          [D]: undefined,
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

    expect(trie).toEqual(result);
  });

  test('deletes the first sibling when parent is a leaf (2.3)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abd', 333);
    deleteLeaf(getLeaf(trie, 'abc'));

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
          key: 'ab',
          value: 111,
          isLeaf: true,
          leafCharCodes: null,
          suggestions: null,
          [C]: undefined,
          [D]: {
            charCode: D,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abd',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
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
    result[A]![B]!.next = result[A]![B]![D]!;
    result[A]![B]!.last = result[A]![B]![D]!;

    result[A]![B]![D]!.parent = result[A]![B]!;
    result[A]![B]![D]!.prev = result[A]![B]!;

    expect(trie).toEqual(result);
  });

  test('deletes an intermediate sibling when parent is a leaf (2.4)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abd', 333);
    setValue(trie, 'abe', 444);
    deleteLeaf(getLeaf(trie, 'abd'));

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
          key: 'ab',
          value: 111,
          isLeaf: true,
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
          },
          [D]: undefined,
          [E]: {
            charCode: E,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abe',
            value: 444,
            isLeaf: true,
            leafCharCodes: null,
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
    result[A]![B]![C]!.next = result[A]![B]![E]!;

    result[A]![B]![E]!.parent = result[A]![B]!;
    result[A]![B]![E]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('deletes the last sibling when parent has multiple children remaining (2.4)', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abd', 222);
    setValue(trie, 'abe', 333);
    deleteLeaf(getLeaf(trie, 'abe'));

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
          [D]: {
            charCode: D,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abd',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
          [E]: undefined,
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
    result[A]![B]!.last = result[A]![B]![D]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![D]!;

    result[A]![B]![D]!.parent = result[A]![B]!;
    result[A]![B]![D]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('deletes the first sibling when parent has multiple children remaining (2.4)', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abd', 222);
    setValue(trie, 'abe', 333);
    deleteLeaf(getLeaf(trie, 'abc'));

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
          [C]: undefined,
          [D]: {
            charCode: D,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abd',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
          [E]: {
            charCode: E,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abe',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
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
    result[A]![B]!.next = result[A]![B]![D]!;
    result[A]![B]!.last = result[A]![B]![E]!;

    result[A]![B]![D]!.parent = result[A]![B]!;
    result[A]![B]![D]!.prev = result[A]![B]!;
    result[A]![B]![D]!.next = result[A]![B]![E]!;

    result[A]![B]![E]!.parent = result[A]![B]!;
    result[A]![B]![E]!.prev = result[A]![B]![D]!;

    expect(trie).toEqual(result);
  });

  test('deletes an intermediate sibling when parent has multiple children remaining (2.4)', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abd', 222);
    setValue(trie, 'abe', 333);
    deleteLeaf(getLeaf(trie, 'abd'));

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
          [D]: undefined,
          [E]: {
            charCode: E,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abe',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
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
    result[A]![B]![C]!.next = result[A]![B]![E]!;

    result[A]![B]![E]!.parent = result[A]![B]!;
    result[A]![B]![E]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('deletes a single child from a leaf parent (2.2)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    deleteLeaf(getLeaf(trie, 'abc'));

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
        key: 'ab',
        value: 111,
        isLeaf: true,
        leafCharCodes: [B],
        suggestions: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;

    expect(trie).toEqual(result);
  });

  test('deletes the last sibling with  (2.1)', () => {
    setValue(trie, 'ab', 111);
    setValue(trie, 'abc', 222);
    setValue(trie, 'abcd', 333);
    setValue(trie, 'abe', 444);
    deleteLeaf(getLeaf(trie, 'abe'));

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
          key: 'ab',
          value: 111,
          isLeaf: true,
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
              value: 333,
              isLeaf: true,
              leafCharCodes: null,
              suggestions: null,
            },
          },
          [E]: undefined,
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

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      setValue(trie, key, key);
    });

    dictionary.forEach(key => {
      deleteLeaf(getLeaf(trie, key));
    });

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
    };

    expect(trie).toEqual(result);
  });
});
