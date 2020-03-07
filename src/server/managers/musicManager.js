import fs from 'fs';
import nodePath from 'path';
import uuidv4 from 'uuid/v4';
import log from 'electron-log';
import memoize from 'fast-memoize';
import ffmetadata from 'ffmetadata';
import MusicTempo from 'music-tempo';
import childProcess from 'child_process';
import { AudioContext } from 'web-audio-api';
import { musicTypes } from '../config';
import { progress } from '../../main/ipc';

export const metadataApi = {
  get(song) {
    return new Promise((resolve, reject) => {
      ffmetadata.read(song.path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  set(song, metadata) {
    return new Promise((resolve, reject) => {
      ffmetadata.write(song.path, metadata, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(song);
        }
      });
    });
  }
};

export default {
  /**
   * Asynchronously return the song type
   *
   * @param {String} roundType
   * @param {Object} _song
   * @param {Event} event
   * @return {Promise}
   */
  async getSongType(roundType, _song, event) {
    let metadata;
    try {
      metadata = await metadataApi.get(_song);
    } catch (e) {
      console.error(e);
      metadata = {};
    }


    const song = { uuid: uuidv4(), ..._song, metadata };
    if (song.metadata.comment === 'dmp' && Object.keys(musicTypes[roundType]).includes(song.metadata.genre)) {
      return {
        ...song,
        types: [{
          type: song.metadata.genre,
          probability: 100
        }]
      };
    }

    const typeByName = this.getTypeByTitle(roundType, song);

    /** @DEPRECTED as it is very slow */
    // if (typeByName.meta[0].type !== 'unknown') {
    //   progress.songsTreated += 1;
    //   event.sender.send('progress-update', progress);
    //   return Promise.resolve(typeByName);
    // }

    // return this.getTypeByBpm(roundType, song, event);
    /** @DEPRECATED as it is very slow */

    progress.songsTreated += 1;
    event.sender.send('progress-update', progress);
    return typeByName;
  },

  /**
   * Verify if the title of a song contains enough infos to determine its type
   *
   * @param {String} roundType [category of the song. 'lat' or 'std']
   * @param {Object} song
   * @return {Object}
   */
  getTypeByTitle(roundType, song) {
    const {
      name, path, metadata, uuid
    } = song;
    const musicTypesNames = Object.keys(musicTypes[roundType]);
    const songInfos = {
      uuid,
      name,
      path,
      metadata,
      types: this.resetSongTypes()
    };

    const nameModifier = memoize(songName => songName.toLowerCase()
      // removes [clashes ...] to avoid detecting clash timing in pasodoble
      .replace(/(\[(clashes).*\])/g, '')
      // removes 1 or 2 digits at the begining (if there are there)
      // to avoid detecting tracklist number
      .replace(/^[0-9]{1,2}/g, '')
      // removes potential name "track 31" or else to avoid wrong bpm detection
      .replace(/(track\s*[0-9]*)/g, ''));

    musicTypesNames.forEach((type) => {
      const { titles, bpms } = musicTypes[roundType][type];
      const titleMatch = titles.some(title => nameModifier(metadata.title || '').includes(title));
      const bpmMatch = bpms.some(bpm => nameModifier(name).includes(bpm));
      const fileNameMatch = titles.some(title => nameModifier(name).includes(title));

      // If the song name contains an indicator either with the type name or bpm
      if (titleMatch || bpmMatch || fileNameMatch) {
        // If the meta are still containing the 'unknown' default object, remove it
        if (songInfos.types.some(x => x.type === 'unknown')) {
          songInfos.types = [];
        }
        // Add the new possible types
        songInfos.types.push({
          type: titleMatch || fileNameMatch || bpmMatch ? type : null,
          probability: [titleMatch, fileNameMatch, bpmMatch].reduce((oldVal, val) => oldVal + (val ? 1 : 0))
        });
      }
    });

    // If the song has more than one possible type, filter to keep only the high probability (>= 2)
    if (songInfos.types.length > 1) {
      songInfos.types = songInfos.types.filter(type => type.probability >= 2);

      /**
       * If all the type possible were at low probability,
       * just set the meta as unknown, to be handle by bpm
      */
      if (!songInfos.types.length) {
        songInfos.types = this.resetSongTypes();
      }
    }

    return songInfos;
  },


  /**
   * Get the type of the music by checking its bpm
   *
   * @deprecated
   *
   * @param {String} roundType
   * @param {Object} song
   * @param {Event} event
   *
   * @return {Promise}
   */
  getTypeByBpm(roundType, song, event) {
    const { name, path, uuid } = song;
    const musicTypesNames = Object.keys(musicTypes[roundType]);
    const songInfos = {
      uuid,
      name,
      path,
      types: [
        {
          type: 'unknown',
          probability: 0
        }
      ]
    };

    return new Promise((resolve) => {
      let workerPath = '';
      if (process.env.NODE_ENV === 'production') {
        workerPath = nodePath.join(__dirname, '..', '..', 'node_modules', 'bpm-webworker', 'getSongBpmWorker.js');
      } else if (process.env.NODE_ENV === 'development') {
        workerPath = nodePath.join('.', 'src', 'server', 'workers', 'getSongBpmWorker.js');
      } else {
        workerPath = nodePath.join('.', 'workers', 'getSongBpmWorker.js');
      }

      let getSongBpmWorker;
      try {
        getSongBpmWorker = childProcess.fork(workerPath, [
          uuid,
          song.path
        ]);
      } catch (err) {
        log.error(err);
      }

      getSongBpmWorker.on('message', ({ songUuid, songBpm }) => {
        progress.songsTreated += 1;
        event.sender.send('progress-update', progress);
        log.warn(songBpm, songUuid, song.uuid, song.name);

        musicTypesNames.forEach((type) => {
          const { bpms } = musicTypes[roundType][type];

          const isMusicTypeContainingBpm = bpms.some((typeBpm) => {
            const bpmToTest = Math.round(songBpm) / musicTypes[roundType][type].ratio;
            // console.log(name, songBpm, type, typeBpm, Math.round(bpmToTest));
            return typeBpm === Math.round(bpmToTest);
          });

          if (isMusicTypeContainingBpm) {
          // If the meta are still containing the 'unknown' default object, remove it
            if (songInfos.types.some(meta => meta.type === 'unknown')) {
              songInfos.types = [];
            }
            // Add the new possible type
            songInfos.types.push({
              type,
              probability: 1
            });
          }
        });

        if (songInfos.types.length > 1) {
          songInfos.types = this.resetSongTypes();
        }

        resolve(songInfos);
      });
    });
  },

  /**
   * Determine the type of the last song if every other songs are detected
   *
   * @param {Object} round
   * @param {String} roundType
   * @return {String}
   */
  getTypeByDeduction(round, roundType) {
    const musicTypesNames = Object.keys(musicTypes[roundType]);
    const missingMusicType = musicTypesNames.filter(musicType =>
      round.map(song => (musicType === song.types[0].type)).indexOf(true) === -1);

    return missingMusicType[0];
  },


  /**
   * Get the song BPM
   *
   * @param {Object} song
   * @return {Promise}
   */
  getSongBpm(song) {
    const context = new AudioContext();

    return new Promise((resolve, reject) => {
      context.decodeAudioData(fs.readFileSync(song.path), (buffer) => {
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

        resolve(parseFloat(mt.tempo, 10));
      }, err => reject(err));
    });
  },

  resetSongTypes() {
    return [
      {
        type: 'unknown',
        probability: 0
      }
    ];
  }
};
