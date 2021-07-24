const readline = require('readline');
const bench = require('nodemark');
const chalk = require('chalk');
const dictionary = require('./dictionary.json');
const {TrieMap, setTrie, createTrieNode, searchTrie} = require('../../lib/index-cjs');

const dictionaryEntries = dictionary.map((word) => [word, true]);

function test(label, cb, timeout) {
  global.gc();
  process.stdout.write(label);
  readline.cursorTo(process.stdout, 0, null);
  const result = bench(cb, null, timeout);
  console.log(label + result);
}

const trieNode = createTrieNode();

dictionary.forEach((word) => setTrie(trieNode, word, true));

const trieMap = new TrieMap(dictionaryEntries);
const nativeMap = new Map(dictionaryEntries);

console.log(chalk.bold.inverse(' Search '));

test('searchTrie     ', () => searchTrie(trieNode, 'tag', 0), 5000);
test('TrieMap#search ', () => trieMap.search('tag'), 5000);
test('Map#get        ', () => nativeMap.get('tag'), 5000);
