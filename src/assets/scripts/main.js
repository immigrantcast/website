// function timeStringToSeconds (timeString) {
//   let minutes = timeString.split(':')[0]
//   let seconds = timeString.split(':')[1]

//   let totalSeconds = parseInt(minutes * 60) + parseInt(seconds)
//   return totalSeconds
// }

function setEpisodeAudioTime (seconds) {
  let audioPlayer = document.querySelector('#episode-audio-player')
  audioPlayer.currentTime = seconds
}

function getHashTimeVariable () {
  let regex = /\bt=([\dhHmMsS.:]*)(?:,([\dhHmMsS.:]+))?\b/g
  let match = regex.exec(location.hash)
  if (match) {
    return match[1]
  }
  return false
}

function parseTime (str) {
  let plain = /^\d+(\.\d+)?$/g
  let npt = /^(?:npt:)?(?:(?:(\d+):)?(\d\d?):)?(\d\d?)(\.\d+)?$/
  let quirks = /^(?:(\d\d?)[hH])?(?:(\d\d?)[mM])?(\d\d?)[sS]$/

  if (plain.test(str)) {
    return parseFloat(str);
  }

  let match = npt.exec(str) || quirks.exec(str)
  if (match) {
    return (3600 * (parseInt(match[1],10) || 0) + 60 * (parseInt(match[2],10) || 0) + parseInt(match[3],10) + (parseFloat(match[4]) || 0))
  }
  return 0
};

let timeString = getHashTimeVariable()
if (timeString) {
  setEpisodeAudioTime(
    parseTime(timeString)
  )
}

