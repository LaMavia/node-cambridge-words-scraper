const isLabel = (() => {
  const reg = /^-{1,2}/
  return reg.test.bind(reg)
})()
const args = (defaults = {}) => {
  const o = defaults
  const _args = process.argv.slice(2)
  let lastLabel = ''
  for(const arg of _args) {
    if (isLabel(arg)) {
      lastLabel = arg.replace(/-{1,2}/, '')
    } else {
      o[lastLabel] = arg
    }
  }

  return o
}

module.exports = {
  args
}