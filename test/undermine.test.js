const test = require('tape')
const { join } = require('path')
const { writeFile } = require('fs/promises')
const invalidate = require('..')

test('should reset module', async (assert) => {
  assert.plan(2)
  const path = join(__dirname, 'mod-test.js')
  await writeFile(path, `
    module.exports = 'hello'
  `)
  assert.equal(require(path), 'hello')
  await writeFile(path, `
    module.exports = 'world'
  `)
  invalidate(path)
  assert.equal(require(path), 'world')
})

/*test('should reset module dependencies', (assert) => {
  assert.plan(1)
})*/

