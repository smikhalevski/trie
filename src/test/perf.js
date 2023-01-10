const TrieSearch = require('trie-search');
const TrieMap = require('mnemonist/trie-map');
const { arrayTrieEncode, arrayTrieSearch, trieSet, trieCreate, trieSearch } = require('../../lib');
const dictionary = require('./dictionary.json');

const keys = [];
for (const key of dictionary) {
  keys[key.length] = key;
}

function createTrie() {
  const trie = trieCreate();
  for (const key of dictionary) {
    trieSet(trie, key, key);
  }
  return trie;
}

function createMap() {
  const map = new Map();
  for (const key of dictionary) {
    map.set(key, key);
  }
  return map;
}

function createTrieSearch() {
  const trieSearch = new TrieSearch();
  for (const key of dictionary) {
    trieSearch.map(key, key);
  }
  return trieSearch;
}

function createTrieMap() {
  const trieMap = new TrieMap();
  for (const key of dictionary) {
    trieMap.set(key, key);
  }
  return trieMap;
}

keys.length = 20;

describe(
  'Get',
  () => {
    for (const key of keys) {
      describe('Key length ' + key.length, () => {
        test('trieSearch', measure => {
          const trie = createTrie();

          measure(() => {
            trieSearch(trie, key);
          });
        });

        test('arrayTrieSearch', measure => {
          const arrayTrie = arrayTrieEncode(createTrie());

          measure(() => {
            arrayTrieSearch(arrayTrie, key);
          });
        });

        test('Map', measure => {
          const map = createMap();

          measure(() => {
            map.get(key);
          });
        });

        test('trie-search', measure => {
          const trieSearch = createTrieSearch();

          measure(() => {
            trieSearch.search(key);
          });
        });

        test('mnemonist/trie-map', measure => {
          const trieMap = createTrieMap();

          measure(() => {
            trieMap.get(key);
          });
        });
      });
    }
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);

describe(
  'Add a new key',
  () => {
    for (const key of keys) {
      describe('Key length ' + key.length, () => {
        test('trieSet', measure => {
          let trie;

          beforeIteration(() => {
            trie = trieCreate();
          });

          measure(() => {
            trieSet(trie, key, key);
          });
        });

        test('Map', measure => {
          let map;

          beforeIteration(() => {
            map = new Map();
          });

          measure(() => {
            map.set(key, key);
          });
        });

        test('trie-search', measure => {
          let trieSearch;

          beforeIteration(() => {
            trieSearch = new TrieSearch();
          });

          measure(() => {
            trieSearch.map(key, key);
          });
        });

        test('mnemonist/trie-map', measure => {
          let trieMap;

          beforeIteration(() => {
            trieMap = new TrieMap();
          });

          measure(() => {
            trieMap.set(key, key);
          });
        });
      });
    }
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);

describe(
  'Update an existing key',
  () => {
    for (const key of keys) {
      describe('Key length ' + key.length, () => {
        test('trieSet', measure => {
          const trie = createTrie();

          measure(() => {
            trieSet(trie, key, key);
          });
        });

        test('Map', measure => {
          const map = createMap();

          measure(() => {
            map.set(key, key);
          });
        });

        test('trie-search', measure => {
          const trieSearch = createTrieSearch();

          measure(() => {
            trieSearch.map(key, key);
          });
        });

        test('mnemonist/trie-map', measure => {
          const trieMap = createTrieMap();

          measure(() => {
            trieMap.set(key, key);
          });
        });
      });
    }
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);
