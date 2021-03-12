// import { readFile } from 'fs/promises';
const fs = require("fs");
const _ = require('lodash');

const EXCEPTIONS = [
  "гипервизор",
  "будильник",
  "авоська",
  "наугад",
  "–",
  ''
];

const SLICE_SIZE = 100;

const readFile = fs.promises.readFile;

const fileName = process.argv[2] || "textfile.txt";

const main = async () => {
  try {
    const fileContents = await readFile(fileName);
    const fileContentsStr = fileContents.toString().toLowerCase();
    const wordsRaw = fileContentsStr.split(/\r\n|\,*\s|\.*\s/gm);
    const map = wordsRaw.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    const mapEntries = [ ...map.entries() ];
    const mapEntriesUnique = [ ...new Set(mapEntries) ];
    const mapEntriesUniqueSorted = mapEntriesUnique.sort((a, b) => a[1] - b[1]).reverse();
    const mapEntriesUniqueSortedFiltered = mapEntriesUniqueSorted.filter(mapEntryUniqueSorted => !EXCEPTIONS.includes(mapEntryUniqueSorted[0]));
    const mapEntriesUniqueSortedSliced = mapEntriesUniqueSortedFiltered.slice(0, SLICE_SIZE);
    const outputStr = mapEntriesUniqueSortedSliced
      .map(el => `${el[0]}: ${el[1]}`)
      .reduce((acc, el, idx) => idx == 0 ? el : acc + '; ' + el, "");
    console.log(`${SLICE_SIZE} most frequent words:\n${outputStr}`);
  } catch (err) {
    console.error(err);
  }
};

main();