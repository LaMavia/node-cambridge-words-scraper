// @ts-check
const stream = require('stream')
const fs = require('fs-extra')
module.exports.initSaver = () => {
  const saveStream = fs.createWriteStream('formatted.txt', {
    encoding: 'utf-8',
  })

  const readableStream = new stream.Readable({
    read(_) {}
  })
  readableStream.pipe(saveStream)
  debugger
  return {
    push(loaded, format) {
      loaded.map(format).forEach(f => readableStream.push(f, 'utf-8'))
    },
    kill() {
      readableStream.push(null)
    }
  }
}
