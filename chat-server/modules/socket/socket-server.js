const io = require('socket.io');
const SocketRouter = require('./socket-router')

class SocketServer {
  constructor() {
    // ex: [{type: 'router',value: router}]
    this.taskList = [];
    // ex: {  cors: {origin: "http://example:88",methods: ["GET", "POST"]}}
    this.serverConfig = undefined;
  }

  static new(...args) {
    this.instance = this.instance || new this(...args);
    return this.instance;
  }

  /**
   * * store express-session middleware
   * @param {express-session} sessionMiddleware
   */
  bindSession = function (sessionMiddleware) {
    this.sessionMiddleware = sessionMiddleware;
  }

  /**
   * * set server config
   * @param {} options server config, such as cors
   */
  setServerConfig(options) {
    this.serverConfig = options;
  }

  /**
   * * bind http server(express server)
   * @param {} server http server
   */
  bindServer(server) {
    this.io = io(server, this.serverConfig);

    this.io.use((socket, next) => {
      // this.sessionMiddleware(socket.request, socket.request.res || {}, next);
      this.sessionMiddleware(socket.request, {}, next);
    });
  }

  /**
   * * create an connection event and bind listener
   */
  run() {
    this.io.on('connection', (socket) => {

      this.taskList.forEach(task => {
        if (task.type === 'middleware') {
          this.io.use((socket, next) => {
            task.value(socket, next, this.io);
          });
        } else {
          task.value.listenEvent(socket, this.io);
        }
      });
    })
  }

  /**
   * * add router or middleware function
   * @param {SocketRouter} router
   */
  use(instance) {
    if (instance instanceof SocketRouter) {
      this.taskList.push({
        type: 'router',
        value: instance
      })
    } else if (typeof instance === 'function') {
      this.taskList.push({
        type: 'middleware',
        value: instance
      })
    }
  }

  /**
   * * create an SocketRouter instance
   * @return SocketRouter
   */
  Router() {
    return new SocketRouter();
  }
}

var socketServer = SocketServer.new();

module.exports = socketServer;