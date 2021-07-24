import {createTrieNode, ITrieNode, searchTrie, setTrie} from './trie-utils';

export class TrieMap<T> {

  private rootNode = createTrieNode<T>();

  constructor(entries?: Array<[string, T]> | null) {
    if (entries != null) {
      this.setAll(entries);
    }
  }

  set(key: string, value: T): void {
    setTrie(this.rootNode, key, value);
  }

  setAll(entries: Array<[string, T]>): void {
    for (const [key, value] of entries) {
      setTrie(this.rootNode, key, value);
    }
  }

  get(key: string): T | undefined {
    return this.search(key, 0)?.value;
  }

  search(input: string, offset = 0): ITrieNode<T> | undefined {
    return searchTrie(this.rootNode, input, offset);
  }
}
