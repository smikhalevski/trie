import { convertTrie } from '../../main/object';
import { createTrie, setValue, Node } from '../../main';

describe('', () => {
  let trie: Node;

  beforeEach(() => {
    trie = createTrie();
  });

  test('', () => {
    setValue(trie, 'aa', 111);
    setValue(trie, 'aab', 222);
    setValue(trie, 'ccc', 333);

    console.log(JSON.stringify(convertTrie(trie), null, 2));
  });
});
