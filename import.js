let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs');
let TurndownService = require('turndown');
let turndownService = new TurndownService();

let audioFilesNames = require('./audioFileNames.json');

const NEW_ONLY = true;
 
(async () => {
  let feed = await parser.parseURL('https://www.spreaker.com/show/2683877/episodes/feed')
  console.log(feed.title)
 
  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link)
    console.log(item.itunes.explicit)
    // console.log(item.content)
    // console.log(item.pubDate)
    // console.log(new Date(item.pubDate).toISOString())
    console.log(item.enclosure.url)
    // console.log(item.enclosure.length)
    // console.log(item.itunes.image)
    saveEpisodeFile(item)
  })
})();

function saveEpisodeFile (episode) {
  const date = new Date(episode.pubDate).toISOString()
    .replace(/T/, ' ') // replace T with a space
    .replace(/\..+/, '') // delete the dot and everything after
  const fileNameDate = new Date(episode.pubDate).toISOString().split('T')[0]
  let markdownContent = turndownService.turndown(episode.content)
    .replace(/\\- /g, '* ')
  let fileName = null
  let slug = null
  if (typeof audioFilesNames[fileNameDate] !== 'undefined') {
    fileName = audioFilesNames[fileNameDate]
      .replace('.mp3', '')
      .replace('_icast', '')
      .replace(/_/g, '-')
      .toLowerCase()
  }
  if (!fileName) {
    slug = episode.link.split('/').pop().replace('icast-', '')
    fileName = slug
  } else {
    slug = fileName.substring(11)
  }
  const content = `---
title: "${episode.title}"
date: ${date}
slug: "${slug}"
audio: "${audioFilesNames[fileNameDate] || episode.enclosure.url}"
cover: "${episode.itunes.image}"
length: ${episode.enclosure.length}
explicit: ${episode.itunes.explicit}
tags: episode
---
${markdownContent}
`
  const path = `./src/episodes/${fileName}.md`

  if (NEW_ONLY) {
    if (!fs.existsSync(path)) {
      console.log('New episode:', path)
      fs.writeFileSync(path, content)
    }
  } else {
    fs.writeFileSync(path, content)
  }
}
