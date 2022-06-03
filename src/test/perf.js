const TrieSearch = require('trie-search');
const dictionary = require('./dictionary.json');
const {trieSet, trieCreate, trieDelete, trieSearch, trieGet, trieSuggest} = require('../../lib/index-cjs');

const wordsByLengthMap = [];

const trie = trieCreate();
const libMap = new Map();
const libTrieSearch = new TrieSearch();

dictionary.forEach((word) => {
  libMap.set(word, word);
  trieSet(trie, word, word);
  libTrieSearch.map(word, word);

  if (word.length !== 0 && word.length % 5 === 0 && (wordsByLengthMap[word.length] === undefined || wordsByLengthMap[word.length].length < 10)) {
    (wordsByLengthMap[word.length] ||= []).push(word);
  }
});

describe('Search', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {
        measure(() => {
          libMap.get(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {
        measure(() => {
          trieSearch(trie, word, 0);
        });
      });

      test('trie-search', (measure) => {
        measure(() => {
          libTrieSearch.search(word);
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.001});

describe('Search (miss, shorter key)', () => {
  wordsByLengthMap.forEach(([word], length) => {

    word = word.substring(0, word.length - 2);

    describe('Key length ' + length, () => {

      test('Map', (measure) => {
        measure(() => {
          libMap.get(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {
        measure(() => {
          trieSearch(trie, word, 0);
        });
      });

      test('trie-search', (measure) => {
        measure(() => {
          libTrieSearch.search(word);
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.001});

describe('Get', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {
        measure(() => {
          libMap.get(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {
        measure(() => {
          trieGet(trie, word);
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.001});

describe('Set', () => {
  wordsByLengthMap.forEach((words, length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {

        let libMap;

        beforeIteration(() => {
          libMap = new Map();
        });

        measure(() => {
          for (let i = 0; i < words.length; ++i) {
            libMap.set(words[i], words[i]);
          }
        });
      });

      test('@smikhalevski/trie', (measure) => {

        let trie;

        beforeIteration(() => {
          trie = trieCreate();
        });

        measure(() => {
          for (let i = 0; i < words.length; ++i) {
            trieSet(trie, words[i], words[i]);
          }
        });
      });

      test('trie-search', (measure) => {

        let libTrieSearch;

        beforeIteration(() => {
          libTrieSearch = new TrieSearch();
        });

        measure(() => {
          for (let i = 0; i < words.length; ++i) {
            libTrieSearch.map(words[i], words[i]);
          }
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.002});

describe('Delete', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {

        afterIteration(() => {
          libMap.set(word, word);
        });

        measure(() => {
          libMap.delete(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {

        afterIteration(() => {
          trieSet(trie, word, word);
        });

        measure(() => {
          trieDelete(trie, word, word);
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.002});

describe('Suggest', () => {

  test('@smikhalevski/trie', (measure) => {
    measure(() => {
      trieSuggest(trie, 'abbrev', 0);
    });
  });

  test('trie-search', (measure) => {
    measure(() => {
      libTrieSearch.search('abbrev');
    });
  });

}, {warmupIterationCount: 100, targetRme: 0.002});
