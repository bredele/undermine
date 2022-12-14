const test = require('tape')
const { join } = require('path')
const { writeFile } = require('fs/promises')
const invalidate = require('..')

test('should reset module', async (assert) => {
  assert.plan(2)
  const a = join(__dirname, 'a.js')
  await writeFile(a, `
    module.exports = 'hello'
  `)
  assert.equal(require(a), 'hello')
  await writeFile(a, `
    module.exports = 'world'
  `)
  invalidate(a)
  assert.equal(require(a), 'world')
})

test('should reset module dependencies depth 2', async (assert) => {
  assert.plan(2)
  const c = join(__dirname, 'c.js')
  await writeFile(c, `
    module.exports = 'hello'
  `)
  const d = join(__dirname, 'd.js')
  await writeFile(d, `
    const c = require('./c')
    module.exports = c
  `)
  assert.equal(require(d), 'hello')
  invalidate(c)
  await writeFile(c, `
    module.exports = 'world'
  `)
  assert.equal(require(d), 'world')
})

test('should return module stats', async (assert) => {
  assert.plan(2)
  const e = join(__dirname, 'e.js')
  await writeFile(e, `
    module.exports = 'hello'
  `)
  const f = join(__dirname, 'f.js')
  await writeFile(f, `
    const e = require('./e')
    module.exports = e
  `)
  require(f)
  const { filename, dependants } = invalidate(e)
  assert.equal(filename, e)
  assert.deepEqual([...dependants], [f])
})

test('should reset module dependencies depth n + 2', async (assert) => {
  assert.plan(2)
  const g = join(__dirname, 'g.js')
  await writeFile(g, `
    module.exports = 'hello'
  `)
  const h = join(__dirname, 'h.js')
  await writeFile(h, `
    const g = require('./g')
    module.exports = g
  `)
  const i = join(__dirname, 'i.js')
  await writeFile(i, `
    const h = require('./h')
    module.exports = h
  `)
  assert.equal(require(i), 'hello')
  await writeFile(g, `
    module.exports = 'world'
  `)
  invalidate(g)
  assert.equal(require(i), 'world')
})


