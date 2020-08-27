// function timeStringToSeconds (timeString) {
//   let minutes = timeString.split(':')[0]
//   let seconds = timeString.split(':')[1]

//   let totalSeconds = parseInt(minutes * 60) + parseInt(seconds)
//   return totalSeconds
// }

function setEpisodeAudioTime (seconds) {
  let audioPlayer = document.querySelector('#episode-audio-player')
  audioPlayer.currentTime = seconds

  // attempt to auto play audio, won’t work in most 
  setTimeout(() => { 
    audioPlayer.play()
  }, 1000)
}

let urlParams = new URLSearchParams(window.location.search)
let timeString = urlParams.get('time')
if (timeString) {
  setEpisodeAudioTime(timeString)
}

