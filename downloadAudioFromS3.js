const http = require('http')
const fs = require('fs')
const audioFilesNames = require('./audioFileNames.json')
const s3URL = 'http://archive.radioimmigrant.com/episodes/'

const download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest)
  var request = http.get(url, function(response) {
    response.pipe(file)
    file.on('finish', function() {
      file.close(cb)  // close() is async, call cb after close completes.
    })
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest) // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message)
  })
}

Object.keys(audioFilesNames).forEach(date => {
  const file = audioFilesNames[date]
  download(s3URL + file, './src/media/audio/' + file, (err) => {
    if (err) {
      console.log(err)
    }
  })
})