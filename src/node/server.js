import Hapi from 'hapi';
import { nodeConfig } from './config';
import appApi from './api';

const server = new Hapi.Server(nodeConfig);

server.register({
  plugin: appApi
}).then(() => {
  server.start()
    .then(() => {
    // eslint-disable-next-line
    console.log('Server running at:', server.info.uri);
    })
    .catch(err => console.error(err));
}).catch(err => console.error(err));
