const TrieSearch = require('trie-search');
const TrieMap = require('mnemonist/trie-map');
const { encodeTrie, searchEncoded, setValue, createTrie, search } = require('../../lib');
const dictionary = require('./dictionary.json');

const keys = [];
for (const key of dictionary) {
  keys[key.length] = key;
}

function initTrie() {
  const trie = createTrie();
  for (const key of dictionary) {
    setValue(trie, key, key);
  }
  return trie;
}

function initMap() {
  const map = new Map();
  for (const key of dictionary) {
    map.set(key, key);
  }
  return map;
}

function initTrieSearch() {
  const search = new TrieSearch();
  for (const key of dictionary) {
    search.map(key, key);
  }
  return search;
}

function initTrieMap() {
  const trieMap = new TrieMap();
  for (const key of dictionary) {
    trieMap.set(key, key);
  }
  return trieMap;
}

keys.length = 20;

describe('Get', () => {
  test('search', measure => {
    const trie = initTrie();

    for (const key of keys) {
      measure(() => {
        search(trie, key);
      });
    }
  });

  test('searchEncoded', measure => {
    const encodedTrie = encodeTrie(initTrie());

    for (const key of keys) {
      measure(() => {
        searchEncoded(encodedTrie, key);
      });
    }
  });

  test('Map', measure => {
    const map = initMap();

    for (const key of keys) {
      measure(() => {
        map.get(key);
      });
    }
  });

  test('trie-search', measure => {
    const search = initTrieSearch();

    for (const key of keys) {
      measure(() => {
        search.search(key);
      });
    }
  });

  test('mnemonist/trie-map', measure => {
    const trieMap = initTrieMap();

    for (const key of keys) {
      measure(() => {
        trieMap.get(key);
      });
    }
  });
});

describe('Add a new key', () => {
  test('setValue', measure => {
    let trie;

    beforeIteration(() => {
      trie = initTrie();
    });

    for (const key of keys) {
      measure(() => {
        setValue(trie, key, key);
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
    let search;

    beforeIteration(() => {
      search = new TrieSearch();
    });

    for (const key of keys) {
      measure(() => {
        search.map(key, key);
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
  test('setValue', measure => {
    const trie = initTrie();

    for (const key of keys) {
      measure(() => {
        setValue(trie, key, key);
      });
    }
  });

  test('Map', measure => {
    const map = initMap();

    for (const key of keys) {
      measure(() => {
        map.set(key, key);
      });
    }
  });

  test('trie-search', measure => {
    const search = initTrieSearch();

    for (const key of keys) {
      measure(() => {
        search.map(key, key);
      });
    }
  });

  test('mnemonist/trie-map', measure => {
    const trieMap = initTrieMap();

    for (const key of keys) {
      measure(() => {
        trieMap.set(key, key);
      });
    }
  });
});
