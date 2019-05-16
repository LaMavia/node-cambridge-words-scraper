const cheerio = require('cheerio')
const axios = require('axios').default
const stream = require("stream")

const makeUrl = (word = '') =>
  `https://dictionary.cambridge.org/dictionary/english/${word.replace(
    /\s+/g,
    '-'
  )}`

const format = def => {
  return `${def.word}\n${def.defs
    .map((d, i) => `${i + 1}) ${d.def}\nEx${i + 1}.: ${d.eg}`)
    .join('\n')}\n\n\n`
}

/**
 * 
 * @param {String} _word 
 * @param {stream.Readable} stream 
 */
let scrape = async (_word = '', limit = 10) => {
  const html = await axios.get(makeUrl(_word)).then(r => r.data).catch(console.error)
  if(!html) throw new Error(`Word ${_word} not found`)
  const $ = cheerio.load(html)
  let rs = $('.entry-body__el').toArray().filter((_, i) => i < limit) // [...document.querySelectorAll('.entry-body__el')]
  let word
  let defs = rs.reduce((acc, r, i, rs) => {
    const hdr = $('.hw', r)
    if (i === 0) word = hdr.first().text() // r.querySelector('.hw').innerText
    let o = {
      def: $('.def', r).text(), // r.querySelector('.def').innerText,
    }
    const egNode = $('.eg', r) // r.querySelector('.eg')
    if (egNode) o.eg = egNode.text() // egNode.innerText
    acc[i] = o
    return acc
  }, new Array(rs.length).fill(0))
  let out = {
    word,
    defs,
  }
  return out
}

module.exports = {
  scrape,
  format
}
