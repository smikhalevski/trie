const TrieSearch = require('trie-search');
const dictionary = require('./dictionary.json');
const {setTrie, createTrie, deleteTrie, searchTrie} = require('../../lib/index-cjs');

const wordsByLengthMap = new Map();

const jsMap = new Map();
const trie = createTrie();
const trieSearch = new TrieSearch();

dictionary.forEach((word) => {
  jsMap.set(word, word);
  setTrie(trie, word, word);
  trieSearch.map(word, word);

  if (word.length % 5 === 0) {
    const words = wordsByLengthMap.get(word.length) || wordsByLengthMap.set(word.length, []).get(word.length);
    words.push(word);
  }
});

describe('Search', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {
        measure(() => {
          jsMap.get(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {
        measure(() => {
          searchTrie(trie, word);
        });
      });

      test('trie-search', (measure) => {
        measure(() => {
          trieSearch.search(word);
        });
      });
    });
  });
}, {warmupIterationCount: 100, targetRme: 0.001});

describe('Set', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {

        let jsMap;

        beforeIteration(() => {
          jsMap = new Map();
        });

        measure(() => {
          jsMap.get(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {

        let trie;

        beforeIteration(() => {
          trie = createTrie();
        });

        measure(() => {
          setTrie(trie, word, word);
        });
      });

      test('trie-search', (measure) => {

        let trieSearch;

        beforeIteration(() => {
          trieSearch = new TrieSearch();
        });

        measure(() => {
          trieSearch.map(word, word);
        });
      });
    });
  });
}, {warmupIterationCount: 10_000, targetRme: 0.002});

describe('Delete', () => {
  wordsByLengthMap.forEach(([word], length) => {

    describe('Key length ' + length, () => {

      test('Map', (measure) => {

        afterIteration(() => {
          jsMap.set(word, word);
        });

        measure(() => {
          jsMap.delete(word);
        });
      });

      test('@smikhalevski/trie', (measure) => {

        afterIteration(() => {
          setTrie(trie, word, word);
        });

        measure(() => {
          deleteTrie(trie, word, word);
        });
      });
    });
  });
}, {warmupIterationCount: 10_000, targetRme: 0.002});
