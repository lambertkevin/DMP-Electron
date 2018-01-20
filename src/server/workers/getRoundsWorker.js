const path = require('path');
const jsonfile = require('jsonfile');
const { musicDir } = require('../config');
const fileManager = require('../managers/fileManager');


fileManager.getRounds(musicDir)
  .then((res) => {
    jsonfile.writeFileSync(path.join('src', 'server', 'data', 'db.json'), res);
    process.send(res);
  }).catch(err => console.error(err));

