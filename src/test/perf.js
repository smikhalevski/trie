const dictionary = require('./dictionary.json');
const {setTrie, createTrie, searchTrie} = require('../../lib/index-cjs');

const wordsByLength = [];
const trie = createTrie();

dictionary.forEach((word) => {
  (wordsByLength[word.length] ||= []).push(word);
  setTrie(trie, word, word);
});

const jsMap = new Map(dictionary.map((word) => [word, word]));

describe('Longest key ' + wordsByLength.length, () => {

  const words = wordsByLength[wordsByLength.length - 1];

  test('searchTrie', (measure) => {
    let i = 0;
    measure(() => {
      searchTrie(trie, words[i++ % words.length], 0);
    });
  });

  test('Map.get', (measure) => {
    let i = 0;
    measure(() => {
      jsMap.get(words[i++ % words.length]);
    });
  });
}, {targetRme: 0.002});

wordsByLength.forEach((words) => {

  describe('Key length ' + words[0].length, () => {

    test('searchTrie', (measure) => {
      let i = 0;
      measure(() => {
        searchTrie(trie, words[i++ % words.length], 0);
      });
    });

    test('Map.get', (measure) => {
      let i = 0;
      measure(() => {
        jsMap.get(words[i++ % words.length]);
      });
    });
  }, {targetRme: 0.002});
});
