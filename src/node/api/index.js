import Joi from 'joi';
import path from 'path';
import jsonfile from 'jsonfile';
import { musicDir, musicTypes } from '../config';
import fileManager from '../managers/fileManager';
import timingManager from '../managers/timingManager';

const plugin = {
  register: (server) => {
    server.route([
      {
        method: 'GET',
        path: '/dir',
        handler: () => fileManager.getTree(musicDir)
      },
      {
        method: 'GET',
        path: '/test',
        handler: () => 'test'
      },
      {
        method: 'GET',
        path: '/musictypes',
        handler: () => musicTypes
      },
      {
        method: 'POST',
        path: '/edit',
        handler: (request, h) => {
          const { songPath, type } = request.payload;
          const responseCode = fileManager.addTextToFile(songPath, type);

          return h.response().code(responseCode);
        },
        config: {
          validate: {
            payload: {
              songPath: Joi.string().min(1).required(),
              type: Joi.string().min(1).required()
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/folders',
        handler: () => timingManager.createFolders()
      },
      {
        method: 'GET',
        path: '/init',
        handler: (request, h) => {
          const createInitialFolder = timingManager.createInitialFolder();
          return h.response(createInitialFolder.text).code(createInitialFolder.code);
        }
      },
      {
        method: 'GET',
        path: '/generate',
        handler: (() => {
          fileManager.getRounds(musicDir)
            .then((res) => {
              jsonfile.writeFileSync(path.join('src', 'node', 'data', 'db.json'), res);
              return res;
            }).catch(err => console.error(err));
        })
      },
      {
        method: 'GET',
        path: '/rounds',
        handler: () => jsonfile.readFileSync(path.join('src', 'node', 'data', 'db.json'))
      }
    ]);
  },
  pkg: {
    name: 'app-api'
  }
};

export default plugin;
