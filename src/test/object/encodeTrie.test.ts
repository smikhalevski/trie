import { encodeTrie } from '../../main/object';
import { createTrie, setValue, Trie } from '../../main';

describe('', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);
    setValue(trie, 'ccc', 333);

    console.log(JSON.stringify(encodeTrie(trie), null, 2));
  });
});
