var socketServer = require('../modules/socket');
var router = socketServer.Router();
var JsonDatabase = require('../modules/jsondb');
const userDB = new JsonDatabase('user');

// login check

/**
 * * join chat room and get chat users
 */
router.on('join-chat', function (data, socket, io) {
  if (socket.request.session.user) {
    let session = socket.request.session.user;
    userDB.fetchAll(true).update({
      id: session.id,
      isOnline: true,
      socketId: socket.id
    }).save((data) => {
      session.isOnline = true;
      socket.emit('join-chat', {
        status: 'ok',
        result: { describe: 'join chat success' },
        error: {}
      });
      io.emit('users', formatData(data));
    })

    // 加入房间
    socket.join(['game', 'life']);
  }
})

/**
 * * join chat room and get chat users
 */
router.on('users', function (data, socket, io) {
  if (socket.request.session.user) {
    userDB.fetchAll(true).get((data) => {
      socket.emit('users', formatData(data));
    })
  }
})


/**
 * * message listener
 */
router.on('message', function (data, socket, io) {
  // not login
  if (!socket.request.session.user) {
    return socket.emit('error', {
      status: 'fail',
      result: {},
      error: {
        code: 403,
        describe: 'you are not login'
      }
    });
  }

  if (socket.request.session.user.id === data?.sender?.id) {
    io.to(data.receiver.socketId).emit('message', data);
  } else {
    socket.emit('error', {
      status: 'fail',
      result: {},
      error: {
        code: 403,
        describe: 'Your cannot send message on behalf of others'
      }
    });
  }
});

/**
 * * leave chat 
 */
router.on('leave', function (data, socket, io) {
  if (socket.request.session.user && socket.request.session.user.id) {
    userDB
      .fetchAll(true)
      .update({
        id: socket.request.session.user.id,
        isOnline: false
      })
      .get(data => {
        socket.request.session.user.isOnline = false;
        io.emit('users', formatData(data));
      });
  }
});

function formatData(data) {
  data = data || [];
  return {
    status: 'ok',
    result: [
      ...data,
      { socketId: 'game', isRoom: true, name: 'game', isOnline: true },
      { socketId: 'life', isRoom: true, name: 'life', isOnline: true }
    ],
    error: {}
  };
}

module.exports = router;