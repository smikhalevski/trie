const {test} = require('@smikhalevski/perf-test');
const dictionary = require('./dictionary.json');
const {TrieMap, setTrie, createTrieNode, searchTrie} = require('../../lib/index-cjs');

const dictionaryEntries = dictionary.map((word) => [word, true]);

const trieNode = createTrieNode();

dictionary.forEach((word) => setTrie(trieNode, word, true));

const trieMap = new TrieMap(dictionaryEntries);
const nativeMap = new Map(dictionaryEntries);

test('searchTrie     ', () => searchTrie(trieNode, 'tag', 0));
test('TrieMap#search ', () => trieMap.search('tag'));
test('Map#get        ', () => nativeMap.get('tag'));


const words = [];
dictionary.forEach((word) => words[word.length] = word);

console.log('\nTrieMap#search');
for (const word of words) {
  test(word.length + '\t', () => trieMap.search(word));
  global.gc();
}

console.log('\nMap#get');
for (const word of words) {
  test(word.length + '\t', () => nativeMap.get(word));
  global.gc();
}
