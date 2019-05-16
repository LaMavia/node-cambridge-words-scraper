// @ts-check
const fs = require('fs-extra')
const { scrape: cam, format } = require('./sites/cambridge')
const { initSaver } = require('./helpers/save')
const { args } = require('./helpers/parseArgs')
const stream = require('stream')

async function main() {
  console.time('Took')
  const { input, limit } = args({input: "input.txt", limit: 3})
  const inputWords = await fs
    .readFile(input, 'utf-8')
    .catch(err => err !== null && new Error(err))
  if (inputWords instanceof Error) {
    console.error(`Error loading the input file: ${inputWords};\nEXITING`)
    return
  }
  const wordsToLoad = inputWords.split('\n').reduce((acc, l) => {
    if (l && typeof l === 'string') acc.push(l.trim())
    return acc
  }, [])

  const saveStream = initSaver()
  const loaded = (await Promise.all(wordsToLoad.map(w => cam(w, limit)))).filter(Boolean)
  saveStream.push(loaded, format)
  saveStream.kill()
  console.timeEnd('Took')
}

main()
