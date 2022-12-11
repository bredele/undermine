// dependencies
const Module = require('module')

// cache default module require
const load = Module.prototype.require

// dependency tree
const dependencyTree = {}

// extend node module require
Module.prototype.require = function (path) {
  const content = load(path)
  dependencyTree[path] = []
  return content
}

/**
 * Invalidate module with given filename.
 */

module.exports = (filename) => {
  const deps = dependencyTree[filename]
  for (const dep of deps) {
    delete require.cache[dep]
  }
  delete require.cache[filename]
}
