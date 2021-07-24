import {createTrieNode, searchTrieNode, setToTrieNode} from './trie-utils';

export class TrieMap<T> {

  private node = createTrieNode<T>();

  constructor(entries?: Iterable<[string, T]> | null) {
    if (entries != null) {
      this.setAll(entries);
    }
  }

  set(key: string, value: T): void {
    setToTrieNode(this.node, key, value);
  }

  setAll(entries: Iterable<[string, T]>): void {
    new Map(entries).forEach((value, key) => setToTrieNode(this.node, key, value));
  }

  get(key: string): T | undefined {
    return this.search(key, 0);
  }

  search(input: string, offset = 0): T | undefined {
    return searchTrieNode(this.node, input, offset)?.value;
  }
}
