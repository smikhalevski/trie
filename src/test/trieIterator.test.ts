import {Trie, trieCreate, trieSet} from '../main';
import {trieIterator} from '../main/trieIterator';

describe('trieIterator', () => {

  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('returns an iterator', () => {
    const leaf1 = trieSet(trie, 'abc', 111);
    const leaf2 = trieSet(trie, 'abcde', 222);
    const leaf3 = trieSet(trie, 'ab', 333);

    const iterator = trieIterator(trie);
    const fn = jest.fn();

    for (const leaf of iterator) {
      fn(leaf);
    }

    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenNthCalledWith(1, leaf3);
    expect(fn).toHaveBeenNthCalledWith(2, leaf1);
    expect(fn).toHaveBeenNthCalledWith(3, leaf2);
  });
});
