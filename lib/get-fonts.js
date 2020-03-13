'use strict'

const fs = require('fs')
const path = require('path')

const observerScript = fs.readFileSync(
  path.join(__dirname, '..', 'vendor', 'fontfaceobserver.standalone.js'),
  'utf8'
)

const scripts = `
<script>
  ${observerScript}
</script>
`

exports.getFonts = (fontFamily = '') => {
  const fonts = fontFamily
    .split(',')
    .map((font) => font.replace(/['"]/g, '').trim())

  const fontHeader = `
    ${scripts}

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${fonts
      .map((font) => font.replace(/ /g, '+'))
      .join('|')}">
  `

  const fontsToLoad = fonts.map((font) => `new FontFaceObserver('${font}')`)
  const fontLoader = fontsToLoad.length
    ? `Promise.all([ ${fontsToLoad.join(
        ', '
      )} ].map((f) => f.load())).then(ready);`
    : 'ready();'

  return {
    fontHeader,
    fontLoader
  }
}
