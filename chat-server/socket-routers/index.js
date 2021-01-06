var socketServer = require('../modules/socket');
var router = socketServer.Router();
var JsonDatabase = require('../modules/jsondb');
const userDB = new JsonDatabase('user');

/**
 * * cilent connect test 
 */
router.on('connect-test', function (data, socket, io) {
  socket.emit('connect-test', {
    status: 'ok',
    result: { describe: 'connect success' },
    error: {}
  })
})

router.on('disconnect', function (data, socket, io) {
  if (socket.request.session.user && socket.request.session.user.id) {
    userDB
      .fetchAll(true)
      .update({
        id: socket.request.session.user.id,
        isOnline: false
      })
      .get(data => {
        socket.request.session.user.isOnline = false;
        io.emit('users', {
          status: 'ok',
          result: [
            ...data,
            { socketId: 'game', isRoom: true, name: 'game', isOnline: true },
            { socketId: 'life', isRoom: true, name: 'life', isOnline: true }
          ],
          error: {}
        });
      });
  }
})


module.exports = router;