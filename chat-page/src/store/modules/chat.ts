import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators';
import store from '@/store'
import { io, Socket } from 'socket.io-client'

@Module({ name: 'chat', dynamic: true, namespaced: true, store })
export default class Chat extends VuexModule {
  public _socket: Socket | null = null;
  private _listener: {[k: string]: Function[]} = {}

  public get socket(): Socket | null {
    return this._socket;
  }

  public get isConnected(): boolean {
    if (this._socket) {
      return this._socket.connected;
    }
    return false;
  }

  @Mutation
  private SET_SOCKET(socket: Socket | null) {
    this._socket = socket;
  }

  @Action
  public connect(option?: any) {
    option = option || {};
    return new Promise((resolve, reject) => {
      if (this._socket !== null) {
        resolve(this._socket);
      }

      try {
        let socket = option.url === undefined ? io() : io(option.url, option.config);
        socket.on('connect-test', (data: any) => {
          if (data.status === 'ok') {
            socket && this.SET_SOCKET(socket);
            resolve(socket);
          } else {
            reject(data)
          }
        });
        socket.emit('connect-test');
      } catch (error) {
        reject(error)
      }
    })
  }

  @Action
  public disconnect() {
    if (this._socket?.connected) {
      this._socket?.emit('leave');
      this._socket?.disconnect();
      this.SET_SOCKET(null);
    }
  }

  @Action
  public on(options: { eventName: string, callback: Function }) {
    if (this._socket === null || this._socket.connected === false) {
      // throw new Error('The socket is not connected');
      return;
    }
    // store function
    const eventFunction = (data: any) => { options.callback.call(this, data); };
    this._listener[options.eventName] = this._listener[options.eventName] || [];
    this._listener[options.eventName].push(eventFunction);
    // bind event
    this._socket.on(options.eventName, eventFunction);
    
    return () => {
      this._socket!.off(options.eventName, eventFunction);
    }
  }

  @Action
  public off(options: { eventName: string, callback?: Function }) {
    if (this._socket && this._socket.connected) {
      if (options.callback !== undefined) {
        this._socket.off(options.eventName, options.callback);
      } else {
        const callbacks = this._listener[options.eventName] || [];
        callbacks.forEach(callback => {
          this._socket!.off(options.eventName, callback);
        })
        this._listener[options.eventName] = [];
      }
    }
  }

  @Action
  public emit(options: { eventName: string, data?: any }) {
    if (this.isConnected) {
      this._socket?.emit(options.eventName, options.data);
    }
  }
}

export const ChatModule = getModule(Chat);
