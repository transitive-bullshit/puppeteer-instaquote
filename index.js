'use strict'

const puppeteer = require('puppeteer')

const { cssifyObject } = require('css-in-js-utils')
const { getImage } = require('./lib/get-image')
const { getFonts } = require('./lib/get-fonts')

/**
 * Renders the given meme via puppeteer to an `output` file.
 *
 * If you want to load multiple google fonts, juse specify their font-families in `opts.style.fontFamily`
 * separated by commas as you normally would for CSS fonts.
 *
 * The generated html page is returned as a string for debugging and batch rendering purposes.
 *
 * @name renderInstaquote
 * @function
 *
 * @param {object} opts - Configuration options
 * @param {string} opts.output - Path of image file to store result
 * @param {string} opts.quote - Main text (or html) of the content to render.
 * @param {string} opts.author - Main text (or html) of the sub-header (content author).
 * @param {string} [opts.background] - Background image either as a local file path or as a URL (defaults to a transparent background).
 * @param {number} [opts.width=1080] - Optional width of output image
 * @param {number} [opts.height=1080] - Optional height of output image
 * @param {object} [opts.style={}] - Top-level [CSS styles](https://www.w3schools.com/jsref/dom_obj_style.asp) to apply to the top-level container div.
 * @param {object} [opts.quoteStyle={}] - Quote / main content [CSS styles](https://www.w3schools.com/jsref/dom_obj_style.asp) to apply to the main content div.
 * @param {object} [opts.authorStyle={}] - Author [CSS styles](https://www.w3schools.com/jsref/dom_obj_style.asp) to apply to the author's div.
 *
 * @return {Promise}
 */
module.exports = async (opts) => {
  const {
    output,
    quote,
    author,
    background,
    width = 1080,
    height = 1080,
    style = {},
    quoteStyle = {},
    authorStyle = {}
  } = opts

  const bgUri = await getImage(background)

  const fontFamilies = `${style.fontFamily || ''} ${quoteStyle.fontFamily ||
    ''} ${authorStyle.fontFamily || ''}`
  const { fontHeader, fontLoader } = getFonts(fontFamilies)

  const html = `
<html>
<head>
  <meta charset="UTF-8">

  ${fontHeader}

  <style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: transparent;

  ${width ? 'width: ' + width + 'px;' : ''}
  ${height ? 'height: ' + height + 'px;' : ''}

  ${width ? 'max-width: ' + width + 'px;' : ''}
  ${height ? 'max-height: ' + height + 'px;' : ''}

  overflow: hidden;
}

#main {
  width: 100%;
  height: 100%;
  font-size: 5px;

  background: url(${bgUri}) no-repeat center center;

  ${cssifyObject(style)}
}

#content {
  width: 100%;
  height: 100%;
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#quote {
  ${cssifyObject(quoteStyle)}
}

#author {
  display: inline-block;
  margin-top: 1em;

  ${cssifyObject(authorStyle)}
}
  </style>
</head>

<body>

<div id="main">
  <div id="content">
    <div id="wrapper">
      <div id="quote">
        ${quote}
      </div>

      <div id="author">
        ${author}
      </div>
    </div>
  </div>
</div>

<script>
  function ready () {
    let f = 5;

    const content = document.getElementById('content');
    const wrapper = document.getElementById('wrapper');
    const quote = document.getElementById('quote');
    const author = document.getElementById('author');

    // Find the optimal font size to maximize the available layout area without overflow
    do {
      quote.style.fontSize = f + 'px';
      author.style.fontSize = (f * 0.5 | 0) + 'px';
      author.style.marginTop = (f * 0.5 | 0) + 'px';
      f++;

      // console.log(f, quote.clientHeight, content.clientHeight, wrapper.clientHeight);

      if ((${height} && f > ${height * 0.5}) || f > 300) {
        break;
      }
    } while (wrapper.clientHeight < content.clientHeight)

    f -= 2;
    quote.style.fontSize = f + 'px';
    author.style.fontSize = (f * 0.5 | 0) + 'px';
    author.style.marginTop = (f * 0.5 | 0) + 'px';

    // debugger;
    var div = document.createElement('div');
    div.className = 'ready';
    document.body.appendChild(div);
  }

  ${fontLoader}
</script>

</body>
</html>
`

  // testing
  // const fs = require('fs')
  // fs.writeFileSync('test.html', html)

  const browser =
    opts.browser ||
    (await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    }))
  const page = await browser.newPage()

  page.on('console', console.log)
  page.on('error', console.error)

  await page.setViewport({
    deviceScaleFactor: 1,
    width: width || 640,
    height: height || 480
  })
  await page.setContent(html)
  await page.waitForSelector('.ready')

  const frame = page.mainFrame()
  const textHandle = await frame.$('#main')
  await textHandle.screenshot({
    path: output,
    omitBackground: true
  })
  await textHandle.dispose()
  await browser.close()

  return html
}
