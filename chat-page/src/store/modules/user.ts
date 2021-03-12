import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from '@/store'
import API from '@/assets/API'
import axios from 'axios';

@Module({ name: "user", dynamic: true, namespaced: true, store })
export default class User extends VuexModule {
  public _user: any = undefined;
  public _chatUsers: Object[] = [];

  public get user(): any {
    return this._user;
  }

  public get chatUsers(): Object[] {
    return this._chatUsers;
  }

  @Mutation
  public SET_USER(user: any) {
    this._user = user;
  }

  @Mutation
  public SET_CHATUSERS(users: any) {
    this._chatUsers = users;
  }

  @Action
  public login() {
    return axios.post(API.login, {}, { withCredentials: API.cross }).then(res => {
      if (res.data.result.user !== undefined && this._user === undefined) {
        this.SET_USER(res.data.result.user);
      }
    }, error => {
      console.log(error);
    })
  }
}

export const UserModule = getModule(User);
