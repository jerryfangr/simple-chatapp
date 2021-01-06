var socketApp = require('./modules/socket');
var config = require('./assets/config');

socketApp.setServerConfig(undefined);
if (config.cross) {
  socketApp.setServerConfig({
    cors: {
      origin: config.origin,
      credentials: true
    }
  });
}

// router
var indexRouter = require('./socket-routers/index');
var chatRouter = require('./socket-routers/chat');


// add
socketApp.use(indexRouter);
socketApp.use(chatRouter);

module.exports = socketApp;