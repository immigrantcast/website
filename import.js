let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs');
let TurndownService = require('turndown');
let turndownService = new TurndownService();

let audioFilesNames = require('./audioFileNames.json');
 
(async () => {
  let feed = await parser.parseURL('https://www.spreaker.com/show/2683877/episodes/feed')
  console.log(feed.title)
 
  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link)
    console.log(item.content)
    console.log(item.pubDate)
    console.log(new Date(item.pubDate).toISOString())
    console.log(item.enclosure.url)
    console.log(item.enclosure.length)
    console.log(item.itunes.image)
    saveEpisodeFile(item)
  })
})();

function saveEpisodeFile (episode) {
  const date = new Date(episode.pubDate).toISOString()
    .replace(/T/, ' ') // replace T with a space
    .replace(/\..+/, '') // delete the dot and everything after
  const fileNameDate = new Date(episode.pubDate).toISOString().split('T')[0]
  const markdownContent = turndownService.turndown(episode.content)
  let fileName = ''
  if (typeof audioFilesNames[fileNameDate] !== 'undefined') {
    fileName = audioFilesNames[fileNameDate]
      .replace('.mp3', '')
      .replace('_icast', '')
      .replace(/_/g, '-')
      .toLowerCase()
  }
  let slug = fileName.substring(11)
  const content = `---
title: "${episode.title}"
date: ${date}
slug: "${slug}"
audio: "${audioFilesNames[fileNameDate]}"
cover: "${episode.itunes.image}"
length: ${episode.enclosure.length}
tags: episode
---
${markdownContent}
`
  const path = `./src/episodes/${fileName}.md`
  fs.writeFileSync(path, content)
}
