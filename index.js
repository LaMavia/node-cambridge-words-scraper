const pptr = require('puppeteer')
const fs = require('fs-extra')
const path = require('path')

let f = () => {
  let rs = [...document.querySelectorAll('.entry-body__el')]
  let word
  let defs = rs.reduce((acc, r, i, rs) => {
    if (i === 0) word = r.querySelector('.hw').innerText
    let o = {
      def: r.querySelector('.def').innerText,
    }
    const egNode = r.querySelector('.eg')
    if (egNode) o.eg = egNode.innerText
    acc[i] = o
    return acc
  }, new Array(rs.length).fill(0))
  let out = {
    word,
    defs,
  }
  return out
}

let makeUrl = (word = '') =>
  `https://dictionary.cambridge.org/dictionary/english/${word.replace(
    /\s+/g,
    '-'
  )}`

const scrapeWord = (word, browser) =>
  new Promise(async (res, rej) => {
    const page = await browser.newPage()
    const omit = await page.goto(makeUrl(word), {
      waitUntil: 'domcontentloaded'
    }).catch(e => {
      console.error(e)
      return new Error(e)
    })
    if (omit instanceof Error) {
      console.error(`Omitting the word "${word}"`)
      return
    }
    const defs = await page.evaluate(f)
    await page.close()
    res(defs)
  })
main()

async function main() {
  console.time("Took")
  const input = await fs
    .readFile(path.resolve(__dirname, 'input.txt'), 'utf-8')
    .catch(err => err !== null && new Error(err))
  if (input instanceof Error) {
    console.error(`Error loading the input file: ${input};\nEXITING`)
    return
  }
  const wordsToLoad = input.split('\n').reduce((acc, l) => {
    if (l && typeof l === 'string') acc.push(l.trim())
    return acc
  }, [])

  const browser = await pptr.launch({
    headless: true,
  })

  let loaded = (await Promise.all(
    wordsToLoad.map(w => scrapeWord(w, browser))
  )).filter(Boolean)

  await browser.close()
  await fs.writeFile('output.json', JSON.stringify(loaded, null, 2))
  console.timeEnd("Took")
}
