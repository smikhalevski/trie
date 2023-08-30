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

describe('Get', () => {
  test('trieSearch', measure => {
    const trie = createTrie();

    for (const key of keys) {
      measure(() => {
        trieSearch(trie, key);
      });
    }
  });

  test('arrayTrieSearch', measure => {
    const arrayTrie = arrayTrieEncode(createTrie());

    for (const key of keys) {
      measure(() => {
        arrayTrieSearch(arrayTrie, key);
      });
    }
  });

  test('Map', measure => {
    const map = createMap();

    for (const key of keys) {
      measure(() => {
        map.get(key);
      });
    }
  });

  test('trie-search', measure => {
    const trieSearch = createTrieSearch();

    for (const key of keys) {
      measure(() => {
        trieSearch.search(key);
      });
    }
  });

  test('mnemonist/trie-map', measure => {
    const trieMap = createTrieMap();

    for (const key of keys) {
      measure(() => {
        trieMap.get(key);
      });
    }
  });
});

describe('Add a new key', () => {
  test('trieSet', measure => {
    let trie;

    beforeIteration(() => {
      trie = trieCreate();
    });

    for (const key of keys) {
      measure(() => {
        trieSet(trie, key, key);
      });
    }
  });

  test('Map', measure => {
    let map;

    beforeIteration(() => {
      map = new Map();
    });

    for (const key of keys) {
      measure(() => {
        map.set(key, key);
      });
    }
  });

  test('trie-search', measure => {
    let trieSearch;

    beforeIteration(() => {
      trieSearch = new TrieSearch();
    });

    for (const key of keys) {
      measure(() => {
        trieSearch.map(key, key);
      });
    }
  });

  test('mnemonist/trie-map', measure => {
    let trieMap;

    beforeIteration(() => {
      trieMap = new TrieMap();
    });

    for (const key of keys) {
      measure(() => {
        trieMap.set(key, key);
      });
    }
  });
});

describe('Update an existing key', () => {
  test('trieSet', measure => {
    const trie = createTrie();

    for (const key of keys) {
      measure(() => {
        trieSet(trie, key, key);
      });
    }
  });

  test('Map', measure => {
    const map = createMap();

    for (const key of keys) {
      measure(() => {
        map.set(key, key);
      });
    }
  });

  test('trie-search', measure => {
    const trieSearch = createTrieSearch();

    for (const key of keys) {
      measure(() => {
        trieSearch.map(key, key);
      });
    }
  });

  test('mnemonist/trie-map', measure => {
    const trieMap = createTrieMap();

    for (const key of keys) {
      measure(() => {
        trieMap.set(key, key);
      });
    }
  });
});
