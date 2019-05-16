const { args } = require("./helpers/parseArgs")

console.dir(args({
  name: "John"
}), {colors: true, depth: 3})