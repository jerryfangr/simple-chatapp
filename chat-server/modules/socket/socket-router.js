class SocketRouter {
  constructor() {
    // event list
    this.events = [];
  }

  /**
   * * add a event
   * @param {string} eventName 
   * @param {Function} eventFunc 
   */
  on(eventName, eventFunc) {
    let e = {
      name: eventName,
      action: eventFunc
    }
    this.events.push(e);
  }

  /**
   * * create event listener
   * @param {*} socket 
   * @param {*} io 
   */
  listenEvent(socket, io) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      socket.on(event.name, (data) => {
        event.action.call(this, data, socket, io);
      });
    }
  }
}

module.exports = SocketRouter;