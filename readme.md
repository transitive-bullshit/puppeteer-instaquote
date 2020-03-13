# Puppeteer Instaquote

> Instaquote / meme image generator using Puppeteer.

[![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-instaquote.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-instaquote) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Clone locally, then run `yarn` to install dependencies, then `node demo.js` to generate output images.

The first input is an excel spreadsheet containing two columns, one for **Author** and one for **Quote**.

The second input is a list of background images with some optional styles specific to each background image. So for a given background image, you could specify that you want to use a specific font, text color, padding (to identify the space within the output image that you want the text to fit within). It supports any CSS styles and any font from [Google Fonts](https://fonts.google.com/).

It performs **auto-sizing of the text** within the background image's specified padding area, so short quotes will use larger font sizes and longer quotes will automatically use smaller font sizes to ensure that no matter what input you give, the output text will always "fit" within the desired bounds.

## Examples

This repo comes with a demo containing 10 quotes rendered for each of the 9 example background images (so 90 images in total for this demo). This examples use the following Google Fonts: Caveat, Sacramento, Dancing Script, Great Vibes, Rochester, and Calligraffitti.

See [media/output](./media/output) for the full list of example output images.

![](https://raw.githubusercontent.com/transitive-bullshit/puppeteer-instaquote/master/media/output/quote-1-bg-1.png)
![](https://raw.githubusercontent.com/transitive-bullshit/puppeteer-instaquote/master/media/output/quote-4-bg-6.png)
![](https://raw.githubusercontent.com/transitive-bullshit/puppeteer-instaquote/master/media/output/quote-2-bg-3.png)
![](https://raw.githubusercontent.com/transitive-bullshit/puppeteer-instaquote/master/media/output/quote-3-bg-8.png)
![](https://raw.githubusercontent.com/transitive-bullshit/puppeteer-instaquote/master/media/output/quote-8-bg-10.png)

## License

MIT © [Travis Fischer](https://saasify.sh)
