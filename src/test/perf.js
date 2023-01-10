const TrieSearch = require('trie-search');
const TrieMap = require('mnemonist/trie-map');
const {
  arrayTrieEncode,
  arrayTrieGet,
  arrayTrieSearch,
  trieSet,
  trieCreate,
  trieGet,
  trieSearch,
} = require('../../lib/index-cjs');
const dictionary = require('./dictionary.json');

const keys = [];

const trie = trieCreate();
const libMap = new Map();
const libTrieSearch = new TrieSearch();
const libTrieMap = new TrieMap();

for (const key of dictionary) {
  trieSet(trie, key, key);
  libMap.set(key, key);
  libTrieSearch.map(key, key);
  libTrieMap.set(key, key);

  keys[key.length] = key;
}

const arrayTrie = arrayTrieEncode(trie);

keys.length = 20;

describe(
  'Get',
  () => {
    for (const key of keys) {
      describe('Key length ' + key.length, () => {
        test('trieSearch', measure => {
          measure(() => {
            trieSearch(trie, key);
          });
        });

        test('arrayTrieSearch', measure => {
          measure(() => {
            arrayTrieSearch(arrayTrie, key);
          });
        });

        test('Map', measure => {
          measure(() => {
            libMap.get(key);
          });
        });

        test('trie-search', measure => {
          measure(() => {
            libTrieSearch.search(key);
          });
        });

        test('mnemonist/trie-map', measure => {
          measure(() => {
            libTrieMap.get(key);
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
          let libMap;

          beforeIteration(() => {
            libMap = new Map();
          });

          measure(() => {
            libMap.set(key, key);
          });
        });

        test('trie-search', measure => {
          let libTrieSearch;

          beforeIteration(() => {
            libTrieSearch = new TrieSearch();
          });

          measure(() => {
            libTrieSearch.map(key, key);
          });
        });

        test('mnemonist/trie-map', measure => {
          let libTrieMap;

          beforeIteration(() => {
            libTrieMap = new TrieMap();
          });

          measure(() => {
            libTrieMap.set(key, key);
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
          measure(() => {
            trieSet(trie, key, key);
          });
        });

        test('Map', measure => {
          measure(() => {
            libMap.set(key, key);
          });
        });

        test('trie-search', measure => {
          measure(() => {
            libTrieSearch.map(key, key);
          });
        });

        test('mnemonist/trie-map', measure => {
          measure(() => {
            libTrieMap.set(key, key);
          });
        });
      });
    }
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);
