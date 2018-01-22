import path from 'path';
import jsonfile from 'jsonfile';
import { ipcMain } from 'electron';// eslint-disable-line
import { musicDir, musicTypes } from '../server/config';
import fileManager from '../server/managers/fileManager';
import timingManager from '../server/managers/timingManager';

export const progress = {
  songsTreated: 0,
  totalSongs: 0
};

export default () => {
  ipcMain.on('test', (event) => {
    event.returnValue = 'test';
  });

  ipcMain.on('musictypes', (event) => {
    event.returnValue = musicTypes;
  });

  ipcMain.on('edit-song', (event, args) => {
    const { songPath, type } = args;

    try {
      const responseCode = fileManager.addTextToFile(songPath, type);
      event.sender.send('edit-song-response', {
        code: responseCode
      });
    } catch (err) {
      event.sender.send('edit-song-response', {
        code: 400,
        error: err
      });
    }
  });

  ipcMain.on('create-folders', (event) => {
    try {
      timingManager.createFolders();
      event.sender.send('create-folders-response', {
        code: 200
      });
    } catch (err) {
      event.sender.send('create-folders-response', {
        code: 400,
        error: err
      });
    }
  });

  ipcMain.on('init', (event) => {
    try {
      event.returnValue = fileManager.createInitialFolder();
    } catch (err) {
      event.returnValue = {
        code: 400,
        error: err
      };
    }
  });

  ipcMain.on('generate', (event) => {
    progress.songsTreated = 0;
    progress.totalSongs = 0;

    fileManager.getRounds(musicDir, event)
      .then((res) => {
        jsonfile.writeFileSync(path.join('src', 'server', 'data', 'db.json'), res);
        event.sender.send('generate-response', res);
      }).catch(err => console.error(err));
  });

  ipcMain.on('get-rounds', (event) => {
    const jsonTiming = jsonfile.readFileSync(path.join('src', 'server', 'data', 'db.json'));
    event.sender.send('get-rounds-response', jsonTiming);
  });
};
