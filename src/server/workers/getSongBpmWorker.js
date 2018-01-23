/**
 * THIS FILE HAS BEEN MOVED TO A PROPER GITHUB REPO TO BE INSTALLED AS NODE MODULE
 * WHY THE FUCK WOULD I DO THAT? BECAUSE FUCKIN ELECTRON DOES NOT ALLOW ME TO CREATE A CHILD
 * PROCESS FORK FROM A FILE BECAUSE IT REMOVES EVERY FUCKIN FILES THAT'S NOT A NODE MODULE.
 * SO NOW IT'S INSTALLED THIS WAY AND WE CHEAT THEIR SYSTEM TO BE ABLE TO JUST DO A FUCKIN FORK.
 * AND THAT'S A LOT OF FUCKIN.
 *
 * Github repo:
 * https://github.com/kvinlambert/bpm-webworker
 */

const fs = require('fs');
const MusicTempo = require('music-tempo');
const log = require('electron-log');
const { AudioContext } = require('web-audio-api');

const songUuid = process.argv[2];
const songPath = process.argv[3];
const context = new AudioContext();

console.log(songPath);

context.decodeAudioData(fs.readFileSync(songPath), (buffer) => {
  let audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels === 2) {
    const channel1Data = buffer.getChannelData(0);
    const channel2Data = buffer.getChannelData(1);
    const { length } = channel1Data;
    for (let i = 0; i < length; i += 1) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }
  const mt = new MusicTempo(audioData);

  process.send({
    songUuid,
    songBpm: parseFloat(mt.tempo)
  });
}, err => process.send(err));
