'use strict'

const fs = require('fs')
const pMap = require('p-map')
const parse = require('csv-parse/lib/sync')
const render = require('.')

const quotesCsv = fs.readFileSync('example-input.csv')
const quotes = parse(quotesCsv, {
  columns: true,
  skip_empty_lines: true
})

const backgrounds = [
  {
    background: 'media/backgrounds/1.png',
    style: {
      padding: '25% 25% 30%',
      color: '#ddb24a',
      fontFamily: 'Caveat'
    }
  },
  {
    background: 'media/backgrounds/2.png',
    style: {
      padding: '20% 20% 25%',
      color: '#ddb24a',
      fontFamily: 'Sacramento'
    }
  },
  {
    background: 'media/backgrounds/3.png',
    style: {
      padding: '20% 20% 25%',
      color: '#fff',
      fontFamily: 'Dancing Script'
    }
  },
  {
    background: 'media/backgrounds/4.png',
    quoteSize: 0.9,
    style: {
      padding: '36% 27% 40% 26%',
      color: '#fff',
      fontFamily: 'Great Vibes'
    }
  },
  {
    background: 'media/backgrounds/5.png',
    style: {
      padding: '30% 20% 20%',
      color: '#fff',
      fontFamily: 'Rochester'
    }
  },
  {
    background: 'media/backgrounds/6.png',
    quoteSize: 0.8,
    style: {
      padding: '33% 15% 34% 17%',
      color: '#fff',
      fontFamily: 'Rochester'
    }
  },
  {
    background: 'media/backgrounds/7.png',
    style: {
      padding: '20%',
      color: '#fff',
      fontFamily: 'Calligraffitti'
    }
  },
  {
    background: 'media/backgrounds/8.png',
    style: {
      padding: '25%',
      color: '#ddb24a',
      fontFamily: 'Calligraffitti'
    }
  },
  {
    background: 'media/backgrounds/9.png',
    style: {
      padding: '20%',
      color: '#fff',
      fontFamily: 'Calligraffitti'
    }
  },
  {
    background: 'media/backgrounds/10.png',
    style: {
      padding: '30% 20% 20%',
      color: '#ddb24a',
      fontFamily: 'Calligraffitti'
    }
  }
]

const memes = []

for (let i = 0; i < quotes.length; ++i) {
  const { Author, Quote } = quotes[i]

  for (let j = 0; j < backgrounds.length; ++j) {
    const bg = backgrounds[j]
    const output = `media/output/quote-${i + 1}-bg-${j + 1}.png`

    memes.push({
      ...bg,
      output,
      quote: Quote,
      author: Author
    })
  }
}

async function main() {
  await pMap(
    memes,
    async (meme) => {
      console.log('render', meme)
      return render(meme)
    },
    {
      concurrency: 4
    }
  )
}

main()
