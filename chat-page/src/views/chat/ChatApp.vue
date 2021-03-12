<template>
  <div id="chatApp">
    <!-- bar start -->
    <div class="chat-bar">

      <div class="bar-header">
        <img v-if="user" :src="user.avatar" alt="">
      </div>

      <div class="bar-body">
        <div @click="switchWindow" :class="{'switch-btn': true, active: showChoose}">
          {{ switchStatus }}
        </div>
      </div>

    </div>
    <!-- bar end -->

    <!-- content start -->
    <div class="chat-content">
      <chat-selector 
        :userList="userList"
        :unreadUsers="unreadUsers"
        :chooseUser="chooseUser"
        :showChoose="showChoose"
      ></chat-selector>

      <chat-window 
        v-if="isChat"
        :showChoose="showChoose"
        :chatUser="chatUser"
        :newMessage="newMessage"
      ></chat-window>

    </div>
    <!-- content end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChatModule } from '@/store/modules/chat';
import { UserModule } from '@/store/modules/user';
import ChatSelector from './components/ChatSelector.vue';
import ChatWindow from './components/ChatWindow.vue';

@Component({name: 'ChapApp', components: {ChatSelector, ChatWindow}})
export default class extends Vue {
  private user: Object | null = null;
  private isChat: boolean = false;
  private userList: Object[] = [];
  private unreadUsers: Object[] = [];
  private newMessage: Object | null = null;
  private chatUser: Object | null = null;
  private switchStatus: string = 'user';
  private showChoose: boolean = true;
  private isActive: boolean = true;

  get username(): string {
    return UserModule.user?.name || ''
  }

  created() {
    this.user = UserModule.user || {};
  }

  beforeMount() {
    if (ChatModule.isConnected) {
      this.changeStatus('get users..');

      ChatModule.on({eventName: 'users', callback: (data: any) => {
        if (data.status === 'ok') {
          (this.$parent as any).isConnecting = false; 
          this.changeStatus('chat');
          this.userList = data.result.filter((user: {[k:string]: any}, index: number) => {
            return user.id !== (this.user as any).id;
          });
        }
      }});

      ChatModule.emit({eventName: 'users'});

      ChatModule.on({
        eventName: 'message', 
        callback: (data: {
          sender: any, 
          receiver: any, 
          message: string 
        }) => {
          // my message
          if (data.sender.id === UserModule.user.id) {
            return;
          }

          if (
            // if me is chatting
            this.isChat 
            // chatting user's message
            && data.sender.id === (this.chatUser as any).id 
            // chatting room's message
            || (data.receiver.isRoom && data.receiver.id === (this.chatUser as any).id)
          ) {
            // just show message
            console.log('new message', data);
            this.newMessage = data;
          } else {
            // store message
            if (this.unreadUsers.indexOf(data.sender.id) === -1) {
              console.log('all', this.unreadUsers);
              console.log('push', data.sender.id);
              this.unreadUsers.push(data.sender.id);
            }
            this.saveMessage(data, this.user);
          }
      }});
    }
  }

  changeStatus(status: string) {
    (this.$parent as any).status = status;
  }

  saveMessage(data: any, receiver: any) {
      let key = 'chatuser-' + receiver.id + '-' + data.sender.id;
      let storage = localStorage[key] || '[]';
      let newChatlist = JSON.parse(storage);
      newChatlist.push(data);
      localStorage[key] = JSON.stringify(newChatlist);
  }

  chooseUser(user: any) {
    this.chatUser = user;
    this.isChat = true;
    this.switchWindow();
    let index = this.unreadUsers.indexOf(user.id);
    if (index != -1) {
      this.unreadUsers.splice(index, 1);
    }
  }

  switchWindow() {
    if (this.switchStatus === 'chat') {
      this.showChoose = true;
      // this.isChat = false;
      this.switchStatus = 'user';
    } else {
      this.switchStatus = 'chat';
      // this.isChat = true;
      this.showChoose = false;
    }
  }

  beforeRouteLeave (to: any, from: any, next: Function) {
    (this.$parent as any).isConnecting = true; 
    this.isActive = false;
    this.changeStatus('disconnect..')
    ChatModule.disconnect();
    setTimeout(()=>{
      (this.$parent as any).isConnecting = false; 
      this.changeStatus('join');
      next();
    }, 200);
  }
}

</script>

<style lang="scss" scoped>
#chatApp {
  width: 100%;
  height: 100%;
  display: flex;

  .chat-bar {
    width: 20%;
    height: 100%;
    background: #82adf7;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    position: relative;
    overflow: hidden;

    .bar-header {
      width: 100%;
      height: 31%;
      @include flex-center(column);

      img {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        box-shadow: 0 0 5px #3a5273;
      }

      div {
        width: 100%;
        margin-top: 2vmin;
        text-align: center;
        font-size: 3.2vmin;
        word-wrap: break-word;
        color: #fdfffd;
        text-shadow: 0 0 3px #ffffff;  
      }
    }

    .bar-body {
      width: 100%;
      height: 69%;
      // position: relative;
      .switch-btn {
        @include abs-center();
        width: 75px;
        height: 75px;
        line-height: 75px;
        font-size: 26px;
        text-align: center;
        background: #568aea;
        border-radius: 10vmin;
        transition: box-shadow .5s;
        box-shadow: 0 0 5px #0b56e0;

        &:hover {
          cursor: pointer;
        }

        &.active {
          box-shadow: 0 0 12px #0b56e0 inset;
        }
      }
    }
  }

  .chat-content {
    width: 80%;
    height: 100%;
    transition: width .5s;
    display: flex;
  }
}
</style>
