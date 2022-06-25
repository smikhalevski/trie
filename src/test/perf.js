const TrieSearch = require('trie-search');
const TrieMap = require('mnemonist/trie-map');
const dictionary = require('./dictionary.json');
const { trieSet, trieCreate, trieDelete, trieSearch, trieSuggest } = require('../../lib/index-cjs');

const wordsByLengthMap = [];

const trie = trieCreate();
const libMap = new Map();
const libTrieSearch = new TrieSearch();
const libTrieMap = new TrieMap();

dictionary.forEach(word => {
  trieSet(trie, word, word);
  libMap.set(word, word);
  libTrieSearch.map(word, word);
  libTrieMap.set(word, word);

  if (wordsByLengthMap[word.length] === undefined || wordsByLengthMap[word.length].length < 10) {
    (wordsByLengthMap[word.length] ||= []).push(word);
  }
});

describe(
  'Search',
  () => {
    wordsByLengthMap.forEach(([word], length) => {
      describe('Key length ' + length, () => {
        test('@smikhalevski/trie', measure => {
          measure(() => {
            trieSearch(trie, word);
          });
        });

        test('Map', measure => {
          measure(() => {
            libMap.get(word);
          });
        });

        test('trie-search', measure => {
          measure(() => {
            libTrieSearch.search(word);
          });
        });

        test('mnemonist/trie', measure => {
          measure(() => {
            libTrieMap.get(word);
          });
        });
      });
    });
  },
  { warmupIterationCount: 100, targetRme: 0.001 }
);

describe(
  'Set',
  () => {
    wordsByLengthMap.forEach((words, length) => {
      describe('Key length ' + length, () => {
        test('@smikhalevski/trie', measure => {
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

        test('Map', measure => {
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

        test('trie-search', measure => {
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

        test('mnemonist/trie', measure => {
          let libTrieMap;

          beforeIteration(() => {
            libTrieMap = new TrieMap();
          });

          measure(() => {
            for (let i = 0; i < words.length; ++i) {
              libTrieMap.set(words[i], words[i]);
            }
          });
        });
      });
    });
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);

describe(
  'Delete',
  () => {
    wordsByLengthMap.forEach(([word], length) => {
      describe('Key length ' + length, () => {
        test('@smikhalevski/trie', measure => {
          afterIteration(() => {
            trieSet(trie, word, word);
          });

          measure(() => {
            trieDelete(trie, word, word);
          });
        });

        test('Map', measure => {
          afterIteration(() => {
            libMap.set(word, word);
          });

          measure(() => {
            libMap.delete(word);
          });
        });

        test('mnemonist/trie', measure => {
          afterIteration(() => {
            libTrieMap.set(word, word);
          });

          measure(() => {
            libTrieMap.delete(word);
          });
        });
      });
    });
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);

describe(
  'Suggest',
  () => {
    test('@smikhalevski/trie', measure => {
      measure(() => {
        trieSuggest(trie, 'abb');
      });
    });

    test('trie-search', measure => {
      measure(() => {
        libTrieSearch.search('abb');
      });
    });

    test('mnemonist/trie', measure => {
      measure(() => {
        libTrieMap.find('abb');
      });
    });
  },
  { warmupIterationCount: 100, targetRme: 0.002 }
);
