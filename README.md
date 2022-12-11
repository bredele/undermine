# Undermine

Reset module cache and all its dependencies.

## Usage 

Here's an example to invalidate the 

```js
const invalidate = require('undermine')
const { join } = require('path')

require('./mymod')
invalidate(join(__dirname, './mymod.js'))
```

Please note you will need to pass the module filename to `invalidate`

## Install 

```sh
# install from registry
$ npm i undermine
```

## Copyrights

