let Parser = require('rss-parser')
let parser = new Parser()
let fs = require('fs')
let TurndownService = require('turndown')
let turndownService = new TurndownService()

let audioFilesNames = require('./audioFileNames.json')

const NEW_ONLY = true
const FEED = 'https://www.spreaker.com/show/2683877/episodes/feed'

;(async () => {
  const feed = await parser.parseURL(FEED)
  console.log(feed.title)

  feed.items.forEach(item => {
    // only import newer episodes, because older ones have different file name format,
    // which results in slugs that are treated as new, even when they aren't
    if (new Date(item.pubDate).getFullYear() < 2023) return
    saveEpisodeFile(item)
  })
})()

function saveEpisodeFile (episode) {
  const date = new Date(episode.pubDate).toISOString()
    .replace(/T/, ' ') // replace T with a space
    .replace(/\..+/, '') // delete the dot and everything after
  const fileNameDate = new Date(episode.pubDate).toISOString().split('T')[0]
  const markdownContent = turndownService.turndown(episode.content)
    .replace(/\\- /g, '* ')

  const fileName = episode.enclosure.url
    .split('/').pop()
    .toLowerCase()

  const slug = fileName
    .replace('.mp3', '')
    .replace(/_/g, '-')
    .replace('-icast-', '-')
    .replace('icast-', '')
    .substring(0, 34)

  const content = `---
title: "${episode.title}"
date: ${date}
slug: "${slug}"
audio: "${audioFilesNames[fileNameDate] || episode.enclosure.url}"
audioAlternative: "${episode.enclosure.url}"
cover: "${episode.itunes.image}"
length: ${episode.enclosure.length}
explicit: ${episode.itunes.explicit}
tags: episode
---

${markdownContent}
`
  const path = `./src/episodes/${slug}.md`

  if (NEW_ONLY) {
    if (!fs.existsSync(path)) {
      console.log('New episode:', path)
      fs.writeFileSync(path, content)
    }
  } else {
    fs.writeFileSync(path, content)
  }
}
