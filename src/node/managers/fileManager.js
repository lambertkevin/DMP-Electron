import fs from 'fs';
import path from 'path';
import dirTree from 'directory-tree';
import musicManager from './musicManager';
import { musicTypes } from '../config';

export default {

  /**
   * Get JSON Tree of a give path
   *
   * @param {String} _path
   * @return {Object}
   */
  getTree(_path) {
    return dirTree(_path, { exclude: /(.DS_Store|.gitkeep)/ });
  },


  /**
   * Get an array of songs with informations for a given subdir path
   *
   * @param {String} subdirPath
   * @return {Array} [of Songs with properties like song type]
   */
  getArrayOfSongTypes(subdirPath) {
    const roundMetas = this.getRoundMetas(subdirPath);
    const tree = this.getTree(subdirPath);
    const { children } = tree;

    return Promise.all(children.map(song => musicManager.getSongType(roundMetas.type, song)))
      .then((result) => {
        const unknownSongTypes = result.filter(songInfos => songInfos.meta[0].type === 'unknown');

        if (unknownSongTypes.length === 1 && result.length === 5) {
          const missingMusicType = musicManager.getTypeByDeduction(result, roundMetas.type);

          unknownSongTypes[0].meta[0] = {
            type: missingMusicType,
            probability: 0.5
          };
        }

        return result;
      })
      .catch(error => ({ error }));
  },


  /**
   * Get a JSON of all the rounds and their informations, plus all the songs contained in it
   * with their informations also
   *
   * @param {String} _path
   * @return {JSON}
   */
  getRounds(_path) {
    const tree = this.getTree(_path);
    const { children } = tree;
    const dancesOrder = {};

    const songsArrayPromise = Promise.all(tree.children.map(child =>
      this.getArrayOfSongTypes(child.path)));

    const roundsArray = children.map((subdir, index) => {
      const roundMetas = this.getRoundMetas(subdir.path);

      if (!musicTypes[roundMetas.type]) {
        return false;
      }

      Object.keys(musicTypes[roundMetas.type]).forEach((musicType, musicIndex) => {
        dancesOrder[musicType] = musicIndex;
      });

      return {
        id: index,
        time: roundMetas.time,
        category: roundMetas.category,
        round: roundMetas.round,
        type: roundMetas.type,
        isDone: false
      };
    });

    return songsArrayPromise.then(songsArray => songsArray.map((songs, index) => ({
      ...roundsArray[index],
      dances: songs.sort((a, b) => dancesOrder[a.meta[0].type] - dancesOrder[b.meta[0].type])
    }))).catch(err => console.error(err));
  },


  /**
   * Parse the name of a folder to get
   * informations about the round
   *
   * @param {String} subdirPath
   * @return {Object}
   */
  getRoundMetas(subdirPath) {
    const { name } = this.getTree(subdirPath);
    const roundMetas = name.split('-');

    return {
      time: roundMetas[0].trim(),
      category: roundMetas[1].trim(),
      round: roundMetas[2].trim(),
      heats: roundMetas[3].trim(),
      type: roundMetas[4].trim()
    };
  },

  addTextToFile(filePath, textToAdd) {
    if (fs.existsSync(filePath)) {
      const actualFileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      const fileDirectory = path.dirname(filePath);
      const newFileName = actualFileName.replace(fileExt, ` ${textToAdd}${fileExt}`);

      fs.renameSync(filePath, path.join(fileDirectory, newFileName));
      return 200;
    }
    return 404;
  }
};
