// dependencies
const Module = require('module')

// cache default module require
const load = Module.prototype.require

// extend node module require
Module.prototype.require = function (path) {
  const content = load.call(this, path)
  addChildDependencies(Module._resolveFilename(path, this))
  return content
}

// dependency tree
const dependencyTree = {}

/**
 * Add child dependencies for a given module.
 * A dependency is a module that will need to be reseted whenever the parent
 * module (with the fiven `modFilename]`) changes.
 *
 * @param {String} modFilename
 * @private
 */ 

const addChildDependencies = (modFilename) => {
  const { children } = require.cache[modFilename]
  for (const { filename } of children) {
    const dep = dependencyTree[filename] = dependencyTree[filename] || [] 
    if (!dep.includes(modFilename)) dep.push(modFilename)
  }
}

/**
 * Invalidate module cache with given filename.
 *
 * @param {String} filename (absolute filename path)
 * @public
 */

module.exports = (filename) => {
  const dependants = dependencyTree[filename]
  if (dependants) {
    for (const dep of dependants) {
      delete require.cache[dep]
    }
  }
  delete require.cache[filename]
  // reset dep tree
  //dependencyTree[filename] = undefined
  return {
    filename,
    dependants
  }
}

